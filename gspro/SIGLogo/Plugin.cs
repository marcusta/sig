using BepInEx;
using HarmonyLib;
using BepInEx.Logging;

namespace GSP_SigLogo
{
  [BepInPlugin("GSP_SigLogo", "GSP_SigLogo", "1.0.0")]
  public class Plugin : BaseUnityPlugin
  {
    public void Awake()
    {
      // Plugin startup logic
      base.Logger.LogInfo("Plugin GSP_SigLogo is loaded!");
      Plugin.Log = base.Logger;
      Harmony harmony = new Harmony("com.gsp.stats");
      base.Logger.LogInfo("==================================");
      harmony.PatchAll();
    }

    public static ManualLogSource Log;

    [HarmonyPatch]
    public class Patch
    {
      [HarmonyPostfix]
      [HarmonyPatch(typeof(homeMenu), "CheckForSystemUpdate")]
      public static void Postfix0(ref homeMenu __instance)
      {
        Plugin.Log.LogInfo("CheckForSystemUpdate");
      }
    }
  }
}
