using System.Collections;
using UnityEngine;
using UnityEngine.Networking;

public class SupabaseSender : MonoBehaviour
{
    [Header("Supabase Config")]
    public string supabaseUrl = "https://ajhgdcskfqbmialrxqza.supabase.co";
    public string supabaseApiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqaGdkY3NrZnFibWlhbHJ4cXphIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDM5Njg5NSwiZXhwIjoyMDg1OTcyODk1fQ.IgIJ8ouRFcrmWrYAS8S2bW5vzgu2mOia0zUjf2r_2bI"; // Or service_role key (secure for server)
    
    public void SendAccuracyData(float peaceAvg, float paperAvg, float rockAvg, float overallAvg)
    {
        StartCoroutine(PostAccuracyCoroutine(peaceAvg, paperAvg, rockAvg, overallAvg));
    }

    private IEnumerator PostAccuracyCoroutine(float peaceAvg, float paperAvg, float rockAvg, float overallAvg)
    {
        string jsonData = JsonUtility.ToJson(new AccuracyData
        {
            peace_avg = peaceAvg,
            paper_avg = paperAvg,
            rock_avg = rockAvg,
            overall_avg = overallAvg
        });

        string url = $"{supabaseUrl}/rest/v1/hand_accuracy";

        UnityWebRequest request = new UnityWebRequest(url, "POST");
        byte[] bodyRaw = System.Text.Encoding.UTF8.GetBytes(jsonData);
        request.uploadHandler = new UploadHandlerRaw(bodyRaw);
        request.downloadHandler = new DownloadHandlerBuffer();
        request.SetRequestHeader("Content-Type", "application/json");
        request.SetRequestHeader("apikey", supabaseApiKey);
        request.SetRequestHeader("Authorization", $"Bearer {supabaseApiKey}");

        yield return request.SendWebRequest();

        if (request.result == UnityWebRequest.Result.Success)
            Debug.Log("✅ Accuracy data sent successfully!");
        else
            Debug.LogError("❌ Supabase error: " + request.error + "\n" + request.downloadHandler.text);
    }

    [System.Serializable]
    private class AccuracyData
    {
        public float peace_avg;
        public float paper_avg;
        public float rock_avg;
        public float overall_avg;
    }
}
