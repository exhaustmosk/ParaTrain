using UnityEngine;

[System.Serializable]
public class HandPoseData
{
    public string poseName;        // "Peace", "Rock"
    public Vector3[] joints;       // MUST be size 21
}
