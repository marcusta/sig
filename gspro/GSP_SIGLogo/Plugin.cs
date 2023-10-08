using BepInEx;
using HarmonyLib;
using BepInEx.Logging;

using UnityEngine;
using UnityEngine.UI;

using System;
using System.Collections.Generic;

using GSP_SIGLogo;

// PnlSettings
// Tournament
// newRoundMenu
// 

namespace GSP_SigLogo {


    [BepInPlugin ("GSP_SigLogo", "GSP_SigLogo", "1.0.0")]
    public class Plugin : BaseUnityPlugin {

        public static SigSettings gameSettings = new("Bay Hill!!", "bayhill_gsp");
        public static ManualLogSource Log;

        public void Awake ()
        {
            // Plugin startup logic
            base.Logger.LogInfo ("Plugin GSP_SigLogo is loaded!");
            Plugin.Log = base.Logger;
            Harmony harmony = new Harmony ("com.gsp.sig");
            base.Logger.LogInfo ("==================================");
            harmony.PatchAll ();
            base.Logger.LogInfo ("SIG logo patch applied");
        }

        [HarmonyPatch (typeof (PlayMnuSettingBtn))]
        [HarmonyPatch ("Btn_click")]
        public static class PlayMnuSettingBtn_Btn_click_Patch {
            public static bool Prefix (PlayMnuSettingBtn __instance)
            {
                // This code will be executed before the original Btn_click method

                Plugin.Log.LogInfo ("Before Btn_click");

                // Return true to run the original method after this, or false to skip the original method
                return true;
            }
        }

        [HarmonyPatch]
        private class Patch {
            private static void Log (string message)
            {
                Plugin.Log.LogInfo (message);
            }

            private static bool isSIGGame = false;

            [HarmonyPostfix]
            [HarmonyPatch (typeof (PlayMnuSettingBtn), "Btn_click")]
            private static void PostfixSettingsClicked (ref PlayMnuSettingBtn __instance)
            {

                Plugin.Log.LogInfo ("After Btn_click");
                if (!isSIGGame) return;
                Plugin.Log.LogInfo ("After Btn_click: isSigGame = true");
                PlayMnuSettingBtn btn = (PlayMnuSettingBtn)__instance;

                __instance.aRndDat.PlayerPnl.SetActive (false);
                __instance.aRndDat.RoundSettingsLeft.SetActive (true);
                __instance.aRndDat.RoundSettingsRight.SetActive (true);

                __instance.mGC.parseDescFile.homeM.topPnl.BtnActiveRoundPlayers.gameObject.transform.parent.gameObject.SetActive (false);

                __instance.aRndDat.gimesDD.GetComponent<DropdownLeftRightNav> ().ToggleInteractable (__instance.aRndDat.gimesDD, false);
                __instance.aRndDat.windDD.GetComponent<DropdownLeftRightNav> ().ToggleInteractable (__instance.aRndDat.windDD, false);
                __instance.aRndDat.muligansDD.GetComponent<DropdownLeftRightNav> ().ToggleInteractable (__instance.aRndDat.muligansDD, false);
                __instance.aRndDat.teeDD.GetComponent<DropdownLeftRightNav> ().ToggleInteractable (__instance.aRndDat.teeDD, false);
                __instance.aRndDat.elevationDD.GetComponent<DropdownLeftRightNav> ().ToggleInteractable (__instance.aRndDat.elevationDD, false);

                __instance.aRndDat.teeDD.GetComponent<DropdownLeftRightNav> ().ToggleInteractable (__instance.aRndDat.teeDD, false);
                __instance.aRndDat.stimpDD.GetComponent<DropdownLeftRightNav> ().ToggleInteractable (__instance.aRndDat.stimpDD, false);
                __instance.aRndDat.concedeDD.GetComponent<DropdownLeftRightNav> ().ToggleInteractable (__instance.aRndDat.concedeDD, false);
                __instance.aRndDat.greenFirmnessDD.GetComponent<DropdownLeftRightNav> ().ToggleInteractable (__instance.aRndDat.greenFirmnessDD, false);
                __instance.aRndDat.fairwayFirmnessDD.GetComponent<DropdownLeftRightNav> ().ToggleInteractable (__instance.aRndDat.fairwayFirmnessDD, false);
                __instance.aRndDat.recipeDD.GetComponent<DropdownLeftRightNav> ().ToggleInteractable (__instance.aRndDat.recipeDD, false);
                __instance.aRndDat.pinDD.GetComponent<DropdownLeftRightNav> ().ToggleInteractable (__instance.aRndDat.pinDD, false);
                __instance.aRndDat.PuttingDD.GetComponent<DropdownLeftRightNav> ().ToggleInteractable (__instance.aRndDat.PuttingDD, false);
                __instance.aRndDat.HLACorrectEnable.interactable = false;
                __instance.aRndDat.BLIenable.interactable = false;
                __instance.aRndDat.AutoConcede.interactable = false;
                __instance.aRndDat.HCPScoringEnable.interactable = false;
            }

            [HarmonyPostfix]
            [HarmonyPatch (typeof (homeMenu), "CheckForSystemUpdatea")]
            private static void PostfixDrawButton (ref homeMenu __instance)
            {
                Log ("PostfixDrawButton called");
                try {
                    homeMenu menu = (homeMenu)__instance;
                    GameObject menuObject = menu.gameObject;
                    Transform canvas = GetCanvas (__instance);
                    Transform menuGlobalWrapperTransform = GetNamedChild (canvas, "MenuGlobalWrapper");
                    Log ("MenuGlobalWrapper: " + GetGameObjectInfo (menuGlobalWrapperTransform.gameObject));
                    Transform pnlTopBar = GetNamedChild (menuGlobalWrapperTransform, "PnlTopBar");
                    Transform btnSettingsTransform = GetNamedChild (pnlTopBar, "BtnSettings");
                    GameObject btnSettings = btnSettingsTransform.gameObject;
                    GameObject newButton = CloneButton ("BtnSig", "SIG", btnSettings, () => {
                        Log ("SIG button clicked!");
                        // hide homeMenu
                        menuObject.SetActive (false);
                        // show newRoundMenu
                        Transform newRoundMenuTransform = GetNamedChild (canvas, "newRoundMenu");
                        menu.mainGameControler.ResetCriticalRoundVaraibles ();
                        menu.FullCoursePathNoExtension = string.Empty;
                        Log ("SIG button clicked! 1");
                        menu.mainGameControler.ActiveGameIsTournament = false;
                        menu.mainGameControler.ActiveGameIsOnline = false;

                        NewRoundScript script = menu.newRoundScript;
                        script.CourseImage.gameObject.SetActive (true);
                        script.CvsOnlinePlayChat.gameObject.SetActive (false);
                        script.TxtOnlineLabel.text = "PLAYERS IN ROOM";
                        script.PnlPlayersInTheRoom.gameObject.SetActive (false);
                        script.InvitePlayers.SetActive (false);
                        menu.mainGameControler.ActiveGameType = 0;
                        for (int i = 0; i < 8; i++) {
                            menu.mainGameControler.player_a [i].color = i;
                        }
                        script.ResetForNewRound ();
                        menu.newRndPP.ResetForNewRound ();
                        GameObject newRoundMenu = GetNamedChild (canvas, "newRoundMenu").gameObject;
                        GetGameObjectInfo (newRoundMenu);
                        menu.img_click_index (gameSettings.CourseFolderName, gameSettings.CourseName);

                        script.DisableDDs ();
                        script.HLACorrectEnable.interactable = false;
                        script.BLIenable.interactable = false;
                        script.AutoConcede.interactable = false;
                        script.HCPScoringEnable.interactable = false;
                        script.ResumeRound.interactable = false;

                        script.pinsDD.value = (int)gameSettings.Pins;
                        script.elevationDD.value = (int)gameSettings.Elevation;
                        script.StimpDD.value = gameSettings.Stimp;
                        script.ConcedeDD.value = gameSettings.Concede;
                        script.GimmiesDD.value = gameSettings.Gimmies;
                        script.MulliganDD.value = gameSettings.Mulligans;
                        script.MulliganDD.interactable = false;
                        script.teeDD.value = gameSettings.Tee;
                        script.FairWayFirmnessDD.value = (int)gameSettings.Fairways;
                        script.GreenFirmnessDD.value = (int)gameSettings.Greens;
                        script.WindDD.value = (int)gameSettings.Wind;
                        script.PlayModeDD.value = gameSettings.PlayMode;

                        newRoundMenu.SetActive (true);
                        script.DisableDDs ();

                        Log ("SIG button clicked! 9");
                        isSIGGame = true;
                    });
                    newButton.transform.SetParent (pnlTopBar, false);
                    newButton.transform.Translate (-300, 0, 0);
                } catch (System.Exception e) {
                    Log ("Error: " + e.Message);
                }
            }

            private static Transform GetCanvas (homeMenu __instance)
            {
                return __instance.transform.parent;
            }

            private static Transform GetNamedChild (Transform parent, string name)
            {
                for (int i = 0; i < parent.childCount; i++) {
                    Transform child = parent.GetChild (i);
                    if (child.name == name)
                        return child;
                }

                return null;
            }

            private static List<Transform> GetChildren (Transform parent)
            {
                List<Transform> children = new List<Transform> ();
                for (int i = 0; i < parent.childCount; i++) {
                    children.Add (parent.GetChild (i));
                }

                return children;
            }

            private static string GetGameObjectInfo (GameObject gameObject)
            {
                string info = gameObject.name + " (";

                Component [] components = gameObject.GetComponents<Component> ();
                for (int i = 0; i < components.Length; i++) {
                    info += components [i].GetType ().Name;

                    // Print additional information for certain components
                    if (components [i] is RectTransform rectTransform) {
                        info += $" [anchoredPosition={rectTransform.anchoredPosition}, sizeDelta={rectTransform.sizeDelta}]";
                    } else if (components [i] is Canvas canvas) {
                        info += $" [renderMode={canvas.renderMode}]";
                    } else if (components [i] is GridLayoutGroup gridLayoutGroup) {
                        info += $" [cellSize={gridLayoutGroup.cellSize}, spacing={gridLayoutGroup.spacing}]";
                    } else if (components [i] is Button button) {
                        info += $" [Button]";
                        // Print additional Button-specific information
                        // For example:
                        info += $" [interactable={button.interactable}]";
                    } else if (components [i] is Text text) {
                        info += $" [Text]";
                        // Print additional Text-specific information
                        // For example:
                        info += $" [text={text.text}, color={text.color}]";
                    }

                    if (i < components.Length - 1)
                        info += ", ";
                }

                info += ")";

                return info;
            }


            private static GameObject CloneButton (string newName, string text, GameObject originalButtonGameObject, UnityEngine.Events.UnityAction clickAction)
            {
                // Create a new GameObject for the button
                GameObject newButtonObject = new GameObject (newName);

                // Add a RectTransform and copy the properties from the original button
                RectTransform newButtonRectTransform = newButtonObject.AddComponent<RectTransform> ();
                RectTransform originalButtonRectTransform = originalButtonGameObject.GetComponent<RectTransform> ();
                newButtonRectTransform.anchorMin = originalButtonRectTransform.anchorMin;
                newButtonRectTransform.anchorMax = originalButtonRectTransform.anchorMax;
                newButtonRectTransform.pivot = originalButtonRectTransform.pivot;
                newButtonRectTransform.anchoredPosition = originalButtonRectTransform.anchoredPosition;
                newButtonRectTransform.sizeDelta = originalButtonRectTransform.sizeDelta;

                // Add a CanvasRenderer
                newButtonObject.AddComponent<CanvasRenderer> ();

                // Add an Image and copy the properties from the original button
                Image newButtonImage = newButtonObject.AddComponent<Image> ();
                Image originalButtonImage = originalButtonGameObject.GetComponent<Image> ();
                newButtonImage.sprite = originalButtonImage.sprite;
                newButtonImage.color = originalButtonImage.color;

                // Add a Button
                Button newButton = newButtonObject.AddComponent<Button> ();
                newButton.targetGraphic = newButtonImage;
                newButton.onClick.AddListener (clickAction);

                // Create a new GameObject for the text
                GameObject newTextObject = new GameObject ("Text");

                // Add a RectTransform and copy the properties from the original button's text
                RectTransform newTextRectTransform = newTextObject.AddComponent<RectTransform> ();
                Text originalButtonText = originalButtonGameObject.GetComponentInChildren<Text> ();
                RectTransform originalButtonTextRectTransform = originalButtonText.GetComponent<RectTransform> ();
                newTextRectTransform.anchorMin = originalButtonTextRectTransform.anchorMin;
                newTextRectTransform.anchorMax = originalButtonTextRectTransform.anchorMax;
                newTextRectTransform.pivot = originalButtonTextRectTransform.pivot;
                newTextRectTransform.anchoredPosition = originalButtonTextRectTransform.anchoredPosition;
                newTextRectTransform.sizeDelta = originalButtonTextRectTransform.sizeDelta;

                // Add a CanvasRenderer
                newTextObject.AddComponent<CanvasRenderer> ();

                // Add a Text and copy the properties from the original button's text
                Text newText = newTextObject.AddComponent<Text> ();
                newText.text = text;
                newText.font = originalButtonText.font;
                newText.fontSize = originalButtonText.fontSize;
                newText.fontStyle = originalButtonText.fontStyle;
                newText.color = originalButtonText.color;
                newText.alignment = originalButtonText.alignment;
                newText.horizontalOverflow = originalButtonText.horizontalOverflow;
                newText.verticalOverflow = originalButtonText.verticalOverflow;

                // Set the Button's targetGraphic to the Text
                newButton.targetGraphic = newText;
                // Add the text to the new button
                newTextObject.transform.SetParent (newButtonObject.transform, false);

                return newButtonObject;
            }

            private static Transform findMenuGlobalWrapper (Transform canvas)
            {
                Log ("findMenuGlobalWrapper called");
                return GetNamedChild (canvas, "MenuGlobalWrapper");
            }

            private static GameObject findPnlTopBar ()
            {
                Log ("findPnlTopBar called");
                return GameObject.Find ("pnlTopBar");
            }

        }
    }
}
