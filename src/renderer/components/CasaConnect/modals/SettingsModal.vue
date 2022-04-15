<template>
  <div class="modal-card">
    <!-- Modal-Card Header Start -->
    <header class="modal-card-head">
      <div class="flex1">
        <h3 class="title is-4 has-text-weight-normal">{{$t('Share-Setting')}}</h3>
      </div>
      <div><button type="button" class="delete" @click="$emit('close')" /></div>
    </header>
    <!-- Modal-Card Header End -->
    <!-- Modal-Card Body Start -->
    <section class="modal-card-body ">
      <div class="node-card">
        <div class="is-flex is-align-items-center">
          <div class="is-flex-grow-1">
            <h4 class="title is-size-65">{{ $t('Shared folders') }}</h4>
          </div>
          <div>
            <b-button type="is-primary" size="is-small" :label="$t('Add')" @click="showDialog('add')" rounded />
          </div>
        </div>
        <b-field class="mb-3 mt-3 has-text-light" expanded :message="step2Message" type="is-danger">
          <div class="folder-container scrollbars-light-auto">
            <div class="folder-item" v-for="(item,index) in shareFolders" :key="item+index">
              <div class="cover is-flex-shrink-0">
                <div class="folder-cover">
                  <img alt="folder" :src="require(`@/assets/img/filebrowser/folder-default.svg`)" class="folder-icon" />
                </div>
              </div>
              <div class="one-line is-flex-grow-1">
                {{item}}
              </div>
              <div class="action mr-2">
                <div @click="showDialog('edit',index)">
                  <b-icon icon="pencil" size="is-small" class="is-clickable"></b-icon>
                </div>

              </div>
              <div class="action mr-2">
                <div @click="deleteShareFolderItem(item)">
                  <b-icon icon="close" size="is-small" class="is-clickable"></b-icon>
                </div>

              </div>
            </div>
          </div>

        </b-field>

        <b-field class="mb-3 mt-3 has-text-light" :label="$t('Default download path')" expanded>
          <b-input v-model="savePath" expanded readonly></b-input>
          <p class="control">
            <b-button type="is-primary" :label="$t('Change')" @click="showFileModal" />
          </p>
        </b-field>

        <b-field :label="$t('Language')">
          <b-select class="set-select" v-model="lang" @input="setLang(lang)" expanded>
            <option value="de_de">Deutsch</option>
            <option value="en_us">English</option>
            <option value="es_es">Español</option>
            <option value="fr_fr">Français</option>
            <option value="it_it">Italiano</option>
            <option value="ru_ru">Русский</option>
            <option value="pl_pl">Polska</option>
            <option value="pt_br">Português (Brasil)</option>
            <option value="zh_cn">简体中文</option>
          </b-select>
        </b-field>
      </div>

    </section>
    <!-- Modal-Card Body End -->
    <!-- Modal-Card Footer Start-->
    <footer class="modal-card-foot is-flex is-align-items-center">
      <div class="flex1"></div>
      <div>
        <b-button :label="$t('OK')" type="is-primary" rounded expaned @click="saveInfo" />
      </div>
    </footer>
    <!-- Modal-Card Footer End -->
  </div>
</template>

<script>
import FilePanel from '@/components/fileList/FilePanel.vue'
import { remove, delay } from 'lodash'
import smoothReflow from 'vue-smooth-reflow'
import { mixin } from '@/mixins/mixin'
const { dialog } = require('electron').remote
export default {
  mixins: [smoothReflow, mixin],
  data () {
    return {
      shardId: '',
      errorType: 'is-success',
      errors: '',
      step2Message: '',
      shareFolders: [],
      savePath: '',
      lang: this.getInitLang()
    }
  },
  watch: {
    shareFolders (val) {
      if (val.length > 0) {
        this.step2Message = ''
      }
    }
  },
  created () {
    this.getShareFolders()
    this.getSavePath()
  },
  mounted () {
    delay(() => {
      // Smooth
      this.$smoothReflow({
        el: '.modal-card',
        property: ['height', 'width'],
        transition: 'height .25s ease, width .75s ease-out'
      })
    }, 1000)
  },
  methods: {

    getShareFolders () {
      this.$api.person.getMyShareList().then(res => {
        if (res.data.success == 200) {
          this.shareFolders = res.data.data
        }
      })
    },
    getSavePath () {
      this.$api.person.getSavePath().then(res => {
        if (res.data.success == 200) {
          this.savePath = res.data.data
        }
      })
    },
    deleteShareFolderItem (item) {
      this.shareFolders = remove(this.shareFolders, (o) => {
        return o != item
      })
    },

    saveInfo () {
      if (this.shareFolders.length == 0) {
        this.step2Message = this.$t('Need to add at least one directory.')
      } else {
        this.$api.person.updateShareList(this.shareFolders).then(res => {
          if (res.data.success == 200) {
            this.$api.person.updateSavePath(this.savePath).then(res => {
              if (res.data.success == 200) {
                let message = ''
                let type = ''
                if (res.data.success == 200) {
                  message = this.$t('Update successful')
                  type = 'is-success'
                  this.$emit('close')
                } else {
                  message = this.$t('Update failed')
                  type = 'is-danger'
                }
                this.$buefy.toast.open({
                  message: message,
                  type: type
                })
              }
            })
          }
        })
      }
    },
    showDialog (action, itemIndex = 0) {
      dialog.showOpenDialog({
        properties: ['openDirectory'] // 设置选择文件的方式
      }).then(({ canceled, filePaths }) => { // 回调
        if (!canceled) { // 判断选择文件时是否点击取消按钮
          let path = filePaths[0]
          if (action == 'add') {
            if (this.shareFolders.indexOf(path) == -1) {
              this.shareFolders.push(path)
            }
          } else if (action == 'edit') {
            this.shareFolders[itemIndex] = path
            this.$forceUpdate()
          }
          console.log(path) // 返回的文件夹路径
        }
      })
    },
    showFolderModal (action, initPath, itemIndex = 0) {
      this.$buefy.modal.open({
        parent: this,
        component: FilePanel,
        hasModalCard: true,
        customClass: 'fileModal',
        trapFocus: true,
        canCancel: ['escape'],
        scroll: 'keep',
        animation: 'zoom-in',
        events: {
          'updatePath': (e) => {
            if (action == 'add') {
              if (this.shareFolders.indexOf(e) == -1) {
                this.shareFolders.push(e)
              }
            } else if (action == 'edit') {
              this.shareFolders[itemIndex] = e
              this.$forceUpdate()
            }
          }
        },
        props: {
          initPath: initPath,
          rootPath: '/DATA',
          showFile: false
        }
      })
    },

    showFileModal () {
      dialog.showOpenDialog({
        defaultPath: this.savePath,
        properties: ['openDirectory'] // 设置选择文件的方式
      }).then(({ canceled, filePaths }) => { // 回调
        if (!canceled) { // 判断选择文件时是否点击取消按钮
          let path = filePaths[0]
          this.savePath = path
        }
      })
    }
  }
}
</script>

<style>
</style>