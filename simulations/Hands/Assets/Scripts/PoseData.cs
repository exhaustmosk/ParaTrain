using UnityEngine;
using System.Collections.Generic;

[System.Serializable]
public class PoseDefinition
{
    public string poseName;
    public Vector3[] landmarks; // 21 points
}

public class PoseData : MonoBehaviour
{
    public List<PoseDefinition> poses = new List<PoseDefinition>();

    public PoseDefinition GetPose(string name)
    {
        return poses.Find(p => p.poseName == name);
    }
}
