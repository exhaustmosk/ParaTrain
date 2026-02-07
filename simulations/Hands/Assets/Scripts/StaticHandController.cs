using UnityEngine;
using System.Collections.Generic;

public class StaticHandController : MonoBehaviour
{
    [Header("Prefabs & Root")]
    public GameObject jointPrefab;      // Sphere prefab for joints
    public Transform wristRoot;         // Root of static hand

    [Header("Hand Settings")]
    public float scale = 2f;            // Unity scale
    private List<GameObject> joints = new List<GameObject>();  // 21 joints

    private float timer = 0f;
    private float changeInterval;

    // Predefined poses
    private enum PoseType { Rock, Peace }
    private PoseType currentPose;

    void Start()
    {
        if (wristRoot == null) wristRoot = this.transform;

        // Create 21 joint spheres
        for (int i = 0; i < 21; i++)
        {
            GameObject joint = Instantiate(jointPrefab, Vector3.zero, Quaternion.identity, wristRoot);
            joints.Add(joint);
        }

        // Pick first random pose
        changeInterval = Random.Range(10f, 15f);
        SetPose((PoseType)Random.Range(0, 2));
    }

    void Update()
    {
        timer += Time.deltaTime;
        if (timer > changeInterval)
        {
            timer = 0f;
            changeInterval = Random.Range(10f, 15f);
            SetPose((PoseType)Random.Range(0, 2));
        }
    }

    void SetPose(PoseType pose)
    {
        currentPose = pose;

        // Get keypoints for this pose
        Vector3[] landmarks = GetPoseLandmarks(pose);

        for (int i = 0; i < 21; i++)
        {
            joints[i].transform.localPosition = landmarks[i] * scale;
        }
    }

    // Returns 21 key points for Rock/Fist or Peace
    Vector3[] GetPoseLandmarks(PoseType pose)
    {
        Vector3[] lm = new Vector3[21];
        Vector3 wrist = Vector3.zero;
        lm[0] = wrist;

        float fingerSpread = 0.03f;   // Horizontal spread for fingers
        float fingerLength = 0.08f;   // Vertical length of fingers

        switch (pose)
        {
            case PoseType.Rock: // Fist with slight spacing
                for (int f = 0; f < 5; f++) // 5 fingers
                {
                    int start = 1 + f * 4; // finger starts
                    float xOffset = (f - 2) * 0.015f; // spread fingers slightly (-2 to 2)
                    for (int j = 0; j < 4; j++) // 4 joints per finger
                    {
                        lm[start + j] = new Vector3(
                            xOffset,
                            0.02f * j,       // slight curl vertically
                            -0.02f * j        // curl depth
                        );
                    }
                }
                break;

            case PoseType.Peace: // Peace sign
                // Thumb
                lm[1] = new Vector3(-fingerSpread, 0.02f, -0.02f);
                lm[2] = new Vector3(-fingerSpread - 0.01f, 0.04f, -0.03f);
                lm[3] = new Vector3(-fingerSpread - 0.015f, 0.06f, -0.035f);
                lm[4] = new Vector3(-fingerSpread, 0.08f, -0.04f);

                // Index finger (up)
                lm[5] = new Vector3(-0.01f, 0.03f, -0.02f);
                lm[6] = new Vector3(-0.01f, 0.06f, -0.025f);
                lm[7] = new Vector3(-0.01f, 0.09f, -0.03f);
                lm[8] = new Vector3(-0.01f, 0.12f, -0.035f);

                // Middle finger (up)
                lm[9] = new Vector3(0.01f, 0.03f, -0.02f);
                lm[10] = new Vector3(0.01f, 0.06f, -0.025f);
                lm[11] = new Vector3(0.01f, 0.09f, -0.03f);
                lm[12] = new Vector3(0.01f, 0.12f, -0.035f);

                // Ring finger (folded)
                lm[13] = new Vector3(0.03f, 0.015f, -0.02f);
                lm[14] = new Vector3(0.03f, 0.03f, -0.025f);
                lm[15] = new Vector3(0.03f, 0.045f, -0.03f);
                lm[16] = new Vector3(0.03f, 0.06f, -0.035f);

                // Pinky (folded)
                lm[17] = new Vector3(0.05f, 0.01f, -0.02f);
                lm[18] = new Vector3(0.05f, 0.025f, -0.025f);
                lm[19] = new Vector3(0.05f, 0.04f, -0.03f);
                lm[20] = new Vector3(0.05f, 0.055f, -0.035f);
                break;
        }

        return lm;
    }
}
