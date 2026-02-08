using UnityEngine;
using UnityEngine.UI; // required for UI.Text
using System.Collections.Generic;

public enum HandPoseType
{
    None,
    Paper,
    Peace,
    Rock
}

public class HandPoseProcessor : MonoBehaviour
{
    public HandUDPReceiver udpReceiver;

    private Vector3[] worldLandmarks = new Vector3[21];

    public HandPoseType CurrentGesture { get; private set; } = HandPoseType.None;
    private float sendInterval = 10f; // seconds
    private float timeSinceLastSend = 0f;

    [Header("Reference Poses (Absolute captured coordinates)")]
    public Vector3[] peacePose = new Vector3[21]
    {
        new Vector3(1.43551f, -1.240038f, -7.374073E-06f),
        new Vector3(1.052989f, -1.071078f, 0.2138442f),
        new Vector3(0.7460779f, -0.8212401f, 0.423619f),
        new Vector3(0.8819616f, -0.684514f, 0.6373878f),
        new Vector3(1.197556f, -0.5515717f, 0.8348907f),
        new Vector3(0.7727391f, 0.04273877f, 0.4583528f),
        new Vector3(0.4221481f, 0.6162196f, 0.7305258f),
        new Vector3(0.2168512f, 0.9706912f, 0.8673602f),
        new Vector3(0.07296324f, 1.309199f, 0.956811f),
        new Vector3(1.205424f, 0.1635792f, 0.5210944f),
        new Vector3(1.317121f, 0.7381723f, 0.8166181f),
        new Vector3(1.457525f, 1.138402f, 0.9540832f),
        new Vector3(1.600658f, 1.534528f, 1.00773f),
        new Vector3(1.565905f, 0.06610528f, 0.5885457f),
        new Vector3(1.454586f, -0.2244155f, 0.8334473f),
        new Vector3(1.233588f, -0.6489202f, 0.7959646f),
        new Vector3(1.132075f, -0.8353695f, 0.7038286f),
        new Vector3(1.839647f, -0.1504138f, 0.6849673f),
        new Vector3(1.663129f, -0.5115657f, 0.8054885f),
        new Vector3(1.467238f, -0.8023354f, 0.7254973f),
        new Vector3(1.369368f, -0.9265714f, 0.6276866f)
    };

    public Vector3[] paperPose = new Vector3[21]
    {
        new Vector3(1.316169f, -1.218705f, -4.225893E-06f),
        new Vector3(0.7976937f, -1.149049f, 0.2986087f),
        new Vector3(0.2655393f, -0.9964934f, 0.5001267f),
        new Vector3(-0.1909164f, -0.8721091f, 0.6819063f),
        new Vector3(-0.5799845f, -0.7815577f, 0.8698769f),
        new Vector3(0.551362f, -0.2739966f, 0.4350926f),
        new Vector3(0.1365983f, 0.2285249f, 0.6706414f),
        new Vector3(-0.1157886f, 0.5478792f, 0.8283091f),
        new Vector3(-0.3179216f, 0.8708929f, 0.9498006f),
        new Vector3(0.9250921f, -0.1169667f, 0.4674939f),
        new Vector3(0.7545996f, 0.4748315f, 0.6949155f),
        new Vector3(0.6780386f, 0.8940316f, 0.8634346f),
        new Vector3(0.642457f, 1.293532f, 0.9947683f),
        new Vector3(1.280584f, -0.1341963f, 0.5269288f),
        new Vector3(1.42555f, 0.3933963f, 0.8284274f),
        new Vector3(1.55319f, 0.7638788f, 1.010414f),
        new Vector3(1.658042f, 1.12154f, 1.122166f),
        new Vector3(1.615286f, -0.2794477f, 0.6030163f),
        new Vector3(1.948f, 0.08144349f, 0.8924029f),
        new Vector3(2.200534f, 0.3249688f, 1.019509f),
        new Vector3(2.414376f, 0.5708514f, 1.096584f)
    };

    public Vector3[] rockPose = new Vector3[21]
    {
        new Vector3(1.242123f, -1.14799f, -3.090348E-07f),
        new Vector3(0.8190131f, -1.08181f, 0.2404176f),
        new Vector3(0.4859537f, -0.8898376f, 0.4522773f),
        new Vector3(0.5879176f, -0.7270025f, 0.6506693f),
        new Vector3(0.8511466f, -0.6076272f, 0.8360981f),
        new Vector3(0.4009253f, -0.05987585f, 0.4964826f),
        new Vector3(0.03743589f, 0.474728f, 0.78434f),
        new Vector3(-0.1904699f, 0.8331429f, 0.9502512f),
        new Vector3(-0.3784597f, 1.13745f, 1.08884f),
        new Vector3(0.7801592f, 0.01390569f, 0.4960464f),
        new Vector3(0.6958586f, 0.1850427f, 0.9089886f),
        new Vector3(0.7653838f, -0.3487659f, 0.9390883f),
        new Vector3(0.7908058f, -0.6033459f, 0.9009889f),
        new Vector3(1.155623f, -0.01830429f, 0.5193744f),
        new Vector3(1.137291f, 0.1038051f, 0.9129775f),
        new Vector3(1.07772f, -0.3767319f, 0.8228693f),
        new Vector3(1.018022f, -0.6748898f, 0.6857928f),
        new Vector3(1.485775f, -0.1121208f, 0.5628644f),
        new Vector3(1.717936f, 0.2802774f, 0.9558424f),
        new Vector3(1.905178f, 0.5095218f, 1.058718f),
        new Vector3(2.057207f, 0.78433f, 1.068221f)
    };

    [Header("Reference Visuals")]
    public GameObject keypointPrefab;
    private GameObject[] referenceDots = new GameObject[21];

    private Vector3[] peacePoseRel;
    private Vector3[] paperPoseRel;
    private Vector3[] rockPoseRel;

    [Header("Accuracy Tolerances")]
    public float xyTolerance = 0.05f;
    public float zTolerance  = 0.1f;

    [Header("UI")]
    public Text accuracyText; // assign in inspector

    // ---- New: Per-pose accuracy tracking ----
    private Dictionary<HandPoseType, List<float>> poseAccuracies = new Dictionary<HandPoseType, List<float>>()
    {
        { HandPoseType.Paper, new List<float>() },
        { HandPoseType.Peace, new List<float>() },
        { HandPoseType.Rock, new List<float>() }
    };

    void Start()
    {
        peacePoseRel = NormalizePoseToWrist(peacePose);
        paperPoseRel = NormalizePoseToWrist(paperPose);
        rockPoseRel  = NormalizePoseToWrist(rockPose);

        for (int i = 0; i < 21; i++)
        {
            referenceDots[i] = Instantiate(keypointPrefab, Vector3.zero, Quaternion.identity);
            referenceDots[i].transform.localScale = Vector3.one * 0.05f;
        }
    }

    void Update()
{
    if (udpReceiver == null) return;

    worldLandmarks = udpReceiver.GetCurrentHand();
    if (worldLandmarks.Length != 21) return;

    Vector3[] relativeHand = NormalizePoseToWrist(worldLandmarks);

    float accuracy = DetectGesture(relativeHand);
    UpdateReferenceDots();

    // Record accuracy if a valid gesture
    if (CurrentGesture != HandPoseType.None && accuracy >= 0)
    {
        poseAccuracies[CurrentGesture].Add(accuracy);

        // Compute average for this pose
        float avgPoseAccuracy = AverageList(poseAccuracies[CurrentGesture]);
        Debug.Log($"🖐 {CurrentGesture} Avg Accuracy so far: {avgPoseAccuracy:F1}%");
    }

    // Increment timer
    timeSinceLastSend += Time.deltaTime;
    if (timeSinceLastSend >= sendInterval)
    {
        SendSupabaseData();
        timeSinceLastSend = 0f;
    }
}

// --- Method to send averages to Supabase ---
private void SendSupabaseData()
{
    // Only send if we have at least 1 reading for each pose
    if (poseAccuracies[HandPoseType.Paper].Count > 0 &&
        poseAccuracies[HandPoseType.Peace].Count > 0 &&
        poseAccuracies[HandPoseType.Rock].Count > 0)
    {
        float paperAvg = AverageList(poseAccuracies[HandPoseType.Paper]);
        float peaceAvg = AverageList(poseAccuracies[HandPoseType.Peace]);
        float rockAvg  = AverageList(poseAccuracies[HandPoseType.Rock]);
        float overallAvg = (paperAvg + peaceAvg + rockAvg) / 3f;

        Debug.Log($"📊 Sending to Supabase: Paper={paperAvg:F1}, Peace={peaceAvg:F1}, Rock={rockAvg:F1}, Overall={overallAvg:F1}");

        SupabaseSender supabaseSender = FindObjectOfType<SupabaseSender>();
        if (supabaseSender != null)
        {
            supabaseSender.SendAccuracyData(peaceAvg, paperAvg, rockAvg, overallAvg);
        }
        else
        {
            Debug.LogWarning("SupabaseSender not found!");
        }
    }
}

    float AverageList(List<float> list)
    {
        float sum = 0f;
        foreach (float f in list) sum += f;
        return sum / list.Count;
    }

    float DetectGesture(Vector3[] relativeHand)
    {
        bool index  = IsFingerExtended(5, 6, 7, 8);
        bool middle = IsFingerExtended(9, 10, 11, 12);
        bool ring   = IsFingerExtended(13, 14, 15, 16);
        bool pinky  = IsFingerExtended(17, 18, 19, 20);

        if (index && middle && ring && pinky) CurrentGesture = HandPoseType.Paper;
        else if (index && middle && !ring && !pinky) CurrentGesture = HandPoseType.Peace;
        else if (index && !middle && !ring && pinky) CurrentGesture = HandPoseType.Rock;
        else CurrentGesture = HandPoseType.None;

        float accuracy = 0f;
        if (CurrentGesture != HandPoseType.None)
        {
            Vector3[] referencePose = CurrentGesture switch
            {
                HandPoseType.Paper => paperPoseRel,
                HandPoseType.Peace => peacePoseRel,
                HandPoseType.Rock  => rockPoseRel,
                _ => null
            };
            accuracy = CalculateAccuracyWeighted(relativeHand, referencePose, xyTolerance, zTolerance);
        }

        // Update UI
        if (accuracyText != null)
        {
            accuracyText.text = $"Accuracy: {accuracy:F1}%";
            if (accuracy >= 80f) accuracyText.color = Color.green;
            else if (accuracy >= 60f) accuracyText.color = Color.yellow;
            else accuracyText.color = Color.red;
        }

        return accuracy;
    }

    void UpdateReferenceDots()
    {
        Vector3[] referencePose = CurrentGesture switch
        {
            HandPoseType.Paper => paperPoseRel,
            HandPoseType.Peace => peacePoseRel,
            HandPoseType.Rock  => rockPoseRel,
            _ => null
        };

        if (referencePose == null) return;

        Vector3 wrist = worldLandmarks[0];
        for (int i = 0; i < 21; i++)
            referenceDots[i].transform.position = wrist + referencePose[i];
    }

    Vector3[] NormalizePoseToWrist(Vector3[] absolutePose)
    {
        Vector3 wrist = absolutePose[0];
        Vector3[] relativePose = new Vector3[21];
        for (int i = 0; i < 21; i++)
            relativePose[i] = absolutePose[i] - wrist;
        return relativePose;
    }

    public float CalculateAccuracyWeighted(Vector3[] userPose, Vector3[] referencePose, float toleranceXY, float toleranceZ)
    {
        int matchCount = 0;
        for (int i = 1; i < 21; i++)
        {
            float dx = userPose[i].x - referencePose[i].x;
            float dy = userPose[i].y - referencePose[i].y;
            float dz = userPose[i].z - referencePose[i].z;

            if (dx * dx + dy * dy <= toleranceXY * toleranceXY && Mathf.Abs(dz) <= toleranceZ)
                matchCount++;
        }
        return (matchCount / 20f) * 100f;
    }

    bool IsFingerExtended(int mcp, int pip, int dip, int tip)
    {
        return
            worldLandmarks[tip].y > worldLandmarks[dip].y &&
            worldLandmarks[dip].y > worldLandmarks[pip].y &&
            worldLandmarks[pip].y > worldLandmarks[mcp].y;
    }
}
