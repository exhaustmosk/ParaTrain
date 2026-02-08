using UnityEngine;

public class PoseEvaluator : MonoBehaviour
{
    public PoseData poseData;
    public HandUDPReceiver handReceiver;
    public float tolerance = 0.05f;

    public float EvaluatePose(string poseName)
    {
        PoseDefinition target = poseData.GetPose(poseName);
        if (target == null) return 0f;

        Vector3[] player = handReceiver.GetCurrentHand(); // we’ll add this

        float totalError = 0f;

        Vector3 wristTarget = target.landmarks[0];
        Vector3 wristPlayer = player[0];

        for (int i = 0; i < 21; i++)
        {
            Vector3 targetLocal = target.landmarks[i] - wristTarget;
            Vector3 playerLocal = player[i] - wristPlayer;

            totalError += Vector3.Distance(playerLocal, targetLocal);
        }
        float avgError = totalError / 21f;
        float score = Mathf.Clamp01(1f - avgError / tolerance);

        return score * 100f; // percentage
    }
}
