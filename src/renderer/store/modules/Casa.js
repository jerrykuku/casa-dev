const state = {
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImNhc2EiLCJwYXNzd29yZCI6ImNhc2FvcyIsImV4cCI6MzMxNzQyNTE1MzAsImlzcyI6Imdpbi1ibG9nIn0.-Lb8EO415nio3HYwbH23Y7CC8CzP34VMAoOyNyUIG6c',
  devIp: 'localhost',
  devPort: process.env.SERVER_PORT,
  serviceError: false,
  userinfo: {},
  sidebarOpen: false,
  syncthingKey: '',
  syncthingPort: '',
  searchEngine: '',
  siteLoading: true,
  needInitialization: false,
  widgetsSwitch: {
    clock: true,
    weather: true,
    cpu: true,
    disk: true
  },
  hardwareInfo: {},
  // Files
  pasteFiles: '',
  operateObject: null,
  currentPath: '',
  isViewGird: true,
  // Acc  Share
  isShareViewGird: true,
  currentSharePath: ''
}

const mutations = {
  setToken (state, val) {
    state.token = val
  },
  setServiceError (state, val) {
    state.serviceError = val
  },
  setWidgets (state, val) {
    state.widgetsSwitch[val.k] = val.v
  },
  changeUserInfo (state, val) {
    state.userinfo = val
  },
  changeSideBarState (state) {
    state.sidebarOpen = !state.sidebarOpen
  },
  closeSideBar (state) {
    state.sidebarOpen = false
  },
  changeSyncthingInfo (state, val) {
    state.syncthingKey = val.key
    state.syncthingPort = val.port
  },
  changeSearchEngine (state, val) {
    state.searchEngine = val
  },
  changeSiteLoading (state) {
    state.siteLoading = false
  },
  changeInitialization (state, val) {
    state.needInitialization = val
  },
  changeHardwareInfo (state, val) {
    state.hardwareInfo = val
  },
  changePasteFiles (state, val) {
    state.pasteFiles = val
  },
  changeOperateObject (state, val) {
    state.operateObject = val
  },
  changeCurrentPath (state, val) {
    state.currentPath = val
  },
  changeViewGird (state, val) {
    state.isViewGird = val
  },
  changeShareViewGird (state, val) {
    state.isShareViewGird = val
  },
  changeCurrentSharePath (state, val) {
    state.currentSharePath = val
  }
}

const actions = {

}

export default {
  state,
  mutations,
  actions
}
