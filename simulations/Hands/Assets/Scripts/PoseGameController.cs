using UnityEngine;

public class PoseGameController : MonoBehaviour
{
    public PoseLibrary poseLibrary;
    public PoseDisplayUI poseUI;
    public HandPoseEvaluator evaluator;

    private HandPoseData currentPose;
    private float timer;

    void Start()
    {
        LoadNextPose();
    }

    void Update()
    {
        timer += Time.deltaTime;

        if (timer >= 10f)
        {
            float score = evaluator.EvaluatePose(currentPose);
            Debug.Log($"Pose {currentPose.poseName} accuracy: {score:F1}%");

            LoadNextPose();
        }
    }

    void LoadNextPose()
    {
        timer = 0f;
        currentPose = poseLibrary.GetRandomPose();
        poseUI.ShowPose(currentPose.poseName);
    }
}
