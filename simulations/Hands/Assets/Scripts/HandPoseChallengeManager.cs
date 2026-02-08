using UnityEngine;

public class HandPoseChallengeManager : MonoBehaviour
{
    public HandPoseType currentTargetPose;
    public float poseDuration = 10f;

    private float timer;

    void Start()
    {
        PickRandomPose();
    }

    void Update()
    {
        timer += Time.deltaTime;

        if (timer >= poseDuration)
        {
            PickRandomPose();
            timer = 0f;
        }
    }

    void PickRandomPose()
    {
        currentTargetPose = (HandPoseType)Random.Range(0, 3);
        Debug.Log("🎯 TARGET POSE: " + currentTargetPose);
    }
}
