using UnityEngine;

public class HandPoseJudge : MonoBehaviour
{
    public HandPoseChallengeManager challengeManager;
    public HandPoseProcessor handProcessor; // <-- your DetectGesture() lives here

    void Update()
    {
        if (handProcessor == null || challengeManager == null)
            return;

        if (handProcessor.CurrentGesture == challengeManager.currentTargetPose)
        {
            Debug.Log("✅ MATCH");
        }
        else
        {
            Debug.Log("❌ NOT MATCHING");
        }
    }
}
