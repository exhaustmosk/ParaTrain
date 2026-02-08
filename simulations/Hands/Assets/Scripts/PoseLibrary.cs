using UnityEngine;
using System.Collections.Generic;

public class PoseLibrary : MonoBehaviour
{
    public List<HandPoseData> poses = new List<HandPoseData>();

    public HandPoseData GetRandomPose()
    {
        return poses[Random.Range(0, poses.Count)];
    }
}
