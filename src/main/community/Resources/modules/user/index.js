/**
 * Declare a new page for the User editor.
 * For example, It's used to create pages for user preferences like appearance parameters.
 */
function declareAccount(AccountComponent, additional) {
  return {
    component: AccountComponent,
    ...additional
  }
}

/**
 * Declare a new page for the User editor.
 * For example, It's used to create pages for user workspaces or badges.
 */
function declareProfile(ProfileComponent, additional) {
  return {
    component: ProfileComponent,
    ...additional
  }
}

export {
  declareAccount,
  declareProfile
}
