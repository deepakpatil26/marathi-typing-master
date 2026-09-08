!include nsDialogs.nsh

Var MTMDesktopShortcut

Function MTMDesktopShortcutPage
  nsDialogs::Create 1018
  Pop $0
  ${If} $0 == error
    Abort
  ${EndIf}

  ${NSD_CreateLabel} 0 0 100% 12u "Choose whether to create a Marathi Typing Master shortcut on the desktop:"
  Pop $0
  ${NSD_CreateCheckbox} 0 20u 100% 12u "Create a desktop shortcut"
  Pop $MTMDesktopShortcut
  ${NSD_SetState} $MTMDesktopShortcut ${BST_CHECKED}
  nsDialogs::Show
FunctionEnd

Function MTMDesktopShortcutPageLeave
  ${NSD_GetState} $MTMDesktopShortcut $0
  StrCpy $MTMDesktopShortcut $0
FunctionEnd

!macro customPageAfterChangeDir
  Page custom MTMDesktopShortcutPage MTMDesktopShortcutPageLeave
!macroend

!macro customInstall
  ${If} $MTMDesktopShortcut == ${BST_CHECKED}
    CreateShortCut "$DESKTOP\Marathi Typing Master.lnk" "$INSTDIR\${APP_EXECUTABLE_FILENAME}"
  ${EndIf}
!macroend

!macro customUnInstallSection
  Section "Remove desktop shortcut"
    SetShellVarContext all
    Delete "$DESKTOP\Marathi Typing Master.lnk"
    SetShellVarContext current
    Delete "$DESKTOP\Marathi Typing Master.lnk"
  SectionEnd
!macroend
