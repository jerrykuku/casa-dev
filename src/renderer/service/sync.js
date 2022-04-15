/*
 * @Author: JerryK
 * @Date: 2021-11-11 14:40:38
 * @LastEditors: JerryK
 * @LastEditTime: 2021-11-24 16:20:12
 * @Description:
 * @FilePath: /CasaOS-UI/src/service/sync.js
 */
import { api } from './service.js'

const sync = {
  // Configs
  getConfig () {
    return api.get('/sync/config')
  }

}
export default sync
