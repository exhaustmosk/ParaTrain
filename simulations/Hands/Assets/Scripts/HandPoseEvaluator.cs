using UnityEngine;

public class HandPoseEvaluator : MonoBehaviour
{
    public HandUDPReceiver liveHand;   // your working hand tracker

    public float maxDistance = 0.05f;  // tolerance per joint

    public float EvaluatePose(HandPoseData targetPose)
    {
        float totalError = 0f;

        for (int i = 0; i < 21; i++)
        {
            Vector3 playerJoint = liveHand.GetJointLocalPosition(i);
            Vector3 targetJoint = targetPose.joints[i];

            float dist = Vector3.Distance(playerJoint, targetJoint);
            totalError += Mathf.Min(dist, maxDistance);
        }

        float accuracy = 1f - (totalError / (21 * maxDistance));
        return Mathf.Clamp01(accuracy) * 100f; // percentage
    }
}
