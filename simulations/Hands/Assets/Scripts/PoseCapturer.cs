using UnityEngine;
using System.Collections;

public class PoseCapturer : MonoBehaviour
{
    public HandUDPReceiver udpReceiver;

    void Update()
    {
        if (Input.GetKeyDown(KeyCode.Space)) // Press Space to capture
        {
            StartCoroutine(CapturePose());
        }
    }

    IEnumerator CapturePose()
    {
        Debug.Log("Get ready! Pose capture starting in 5 seconds...");
        yield return new WaitForSeconds(5f);

        Vector3[] hand = udpReceiver.GetCurrentHand();

        if (hand == null || hand.Length != 21 || hand[0] == Vector3.zero)
        {
            Debug.LogWarning("Hand not detected properly!");
            yield break;
        }

        Debug.Log("Captured hand pose:");
        for (int i = 0; i < hand.Length; i++)
        {
            Debug.Log($"{i}: new Vector3({hand[i].x}f, {hand[i].y}f, {hand[i].z}f),");
        }

        Debug.Log("✅ Copy these lines into your reference pose array!");
    }
}
