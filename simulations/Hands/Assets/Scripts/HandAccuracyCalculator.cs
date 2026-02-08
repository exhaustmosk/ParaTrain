using UnityEngine;

public class HandAccuracyCalculator : MonoBehaviour
{
    public static float CalculateAccuracy(Vector3[] userHand, Vector3[] referenceHand, float tolerance = 0.1f)
    {
        if (userHand.Length != 21 || referenceHand.Length != 21)
        {
            Debug.LogError("Hand arrays must have 21 landmarks!");
            return 0f;
        }

        // Step 1: Normalize both hands to wrist
        Vector3 wristUser = userHand[0];
        Vector3 wristRef = referenceHand[0];

        Vector3[] userNormalized = new Vector3[21];
        Vector3[] refNormalized = new Vector3[21];

        for (int i = 0; i < 21; i++)
        {
            userNormalized[i] = userHand[i] - wristUser;
            refNormalized[i]  = referenceHand[i] - wristRef;
        }

        // Step 2: Optional: scale normalization (make hand sizes comparable)
        float userScale = Vector3.Distance(userNormalized[0], userNormalized[9]);  // wrist to middle fingertip
        float refScale  = Vector3.Distance(refNormalized[0], refNormalized[9]);
        float scaleFactor = refScale / Mathf.Max(userScale, 0.0001f); // avoid div 0

        for (int i = 0; i < 21; i++)
            userNormalized[i] *= scaleFactor;

        // Step 3: Calculate per-joint accuracy
        float totalAccuracy = 0f;
        for (int i = 0; i < 21; i++)
        {
            float dist = Vector3.Distance(userNormalized[i], refNormalized[i]);
            float jointAcc = Mathf.Clamp01(1f - dist / tolerance); // 1 = perfect, 0 = out of tolerance
            totalAccuracy += jointAcc;
        }

        // Step 4: Average and return percentage
        return (totalAccuracy / 21f) * 100f;
    }
}
