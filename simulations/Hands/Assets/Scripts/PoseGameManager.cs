using UnityEngine;
using UnityEngine.UI;

public class PoseGameManager : MonoBehaviour
{
    [Header("References")]
    public PoseImageController imageController;
    public PoseEvaluator poseEvaluator;

    [Header("UI")]
    public Text scoreText;

    [Header("Pose Names (must match PoseData)")]
    public string[] poseNames;

    private float timer = 0f;
    private float evaluationTime = 10f;
    private int lastPoseIndex = -1;

    void Update()
    {
        timer += Time.deltaTime;

        // When pose just changed OR 10s passed
        if (imageController.CurrentPoseIndex != lastPoseIndex)
        {
            timer = 0f;
            lastPoseIndex = imageController.CurrentPoseIndex;
            scoreText.text = "Match the pose!";
        }

        // Evaluate ONLY at the END of 10 seconds
        if (timer >= evaluationTime)
        {
            EvaluateCurrentPose();
            timer = -999f; // prevent re-evaluating
        }
    }

    void EvaluateCurrentPose()
    {
        int index = imageController.CurrentPoseIndex;
        string poseName = poseNames[index];

        float score = poseEvaluator.EvaluatePose(poseName);
        scoreText.text = $"Accuracy: {score:F1}%";
        Debug.Log($"Pose {poseName} score: {score}");
    }
}
