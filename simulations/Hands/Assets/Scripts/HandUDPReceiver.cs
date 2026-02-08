using UnityEngine;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading;
using System.Collections.Generic;

public class HandUDPReceiver : MonoBehaviour
{
    Thread receiveThread;
    UdpClient client;
    public int port = 5005; // Must match Python

    [Header("Prefabs")]
    public GameObject palmPrefab;    // Wrist / palm joint
    public GameObject fingerPrefab;  // Finger joints

    [Header("Hand Settings")]
    public float scale = 2.0f;
    public Transform wristRoot;

    private List<GameObject> joints = new List<GameObject>();      // 21 joint objects
    private List<Vector3> latestPositions = new List<Vector3>();  // 21 joint positions

    void Start()
    {
        if (wristRoot == null)
            wristRoot = this.transform;

        // Create 21 joints
        for (int i = 0; i < 21; i++)
        {
            GameObject joint;

            if (i == 0)
                joint = Instantiate(palmPrefab, Vector3.zero, Quaternion.identity, wristRoot);
            else
                joint = Instantiate(fingerPrefab, Vector3.zero, Quaternion.identity, wristRoot);

            joints.Add(joint);
            latestPositions.Add(Vector3.zero);
        }

        // Start UDP receiver thread
        receiveThread = new Thread(ReceiveData);
        receiveThread.IsBackground = true;
        receiveThread.Start();
    }

    void ReceiveData()
    {
        client = new UdpClient(port);
        IPEndPoint anyIP = new IPEndPoint(IPAddress.Any, port);

        while (true)
        {
            try
            {
                byte[] data = client.Receive(ref anyIP);
                string json = Encoding.UTF8.GetString(data);

                HandLandmark[] landmarks = JsonHelper.FromJson<HandLandmark>(json);
                if (landmarks.Length != 21)
                    continue;

                lock (latestPositions)
                {
                    for (int i = 0; i < 21; i++)
                    {
                        Vector3 pos = new Vector3(
                            landmarks[i].x,
                            landmarks[i].y,
                            landmarks[i].z
                        );

                        // Safety against NaNs
                        if (float.IsNaN(pos.x) || float.IsNaN(pos.y) || float.IsNaN(pos.z))
                            pos = Vector3.zero;

                        latestPositions[i] = pos * scale;
                    }
                }
            }
            catch (System.Exception ex)
            {
                Debug.LogWarning("UDP Receive Error: " + ex.Message);
            }
        }
    }

    void Update()
    {
        lock (latestPositions)
        {
            for (int i = 0; i < joints.Count; i++)
            {
                joints[i].transform.localPosition = latestPositions[i];
            }
        }
    }

    // --------------------------------------------------
    // 🔑 HELPER METHOD (FOR POSE EVALUATION)
    // --------------------------------------------------
    public Vector3 GetJointLocalPosition(int index)
    {
        if (index < 0 || index >= joints.Count)
            return Vector3.zero;

        return joints[index].transform.localPosition;
    }

    // --------------------------------------------------
    // DATA STRUCTS
    // --------------------------------------------------
    [System.Serializable]
    public class HandLandmark
    {
        public float x;
        public float y;
        public float z;
    }

    public static class JsonHelper
    {
        public static T[] FromJson<T>(string json)
        {
            string newJson = "{ \"array\": " + json + "}";
            Wrapper<T> wrapper = JsonUtility.FromJson<Wrapper<T>>(newJson);
            return wrapper.array;
        }

        [System.Serializable]
        private class Wrapper<T>
        {
            public T[] array;
        }
    }

    private void OnApplicationQuit()
    {
        if (receiveThread != null)
            receiveThread.Abort();

        if (client != null)
            client.Close();
    }

    public Vector3[] GetCurrentHand()
    {
        return latestPositions.ToArray();
    }

}
