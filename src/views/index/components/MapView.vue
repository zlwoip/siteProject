<template>
  <el-card class="flex-sub chart-item-container" :body-style="{padding: 0}" shadow="never">
    <template #header>
      <div class="text-bold">网管设备辐射范围与空间分布总览</div>
    </template>
    <div class="chart-item">
      <div id="mapDom" class="map-container"></div>
      <div id="info" class="map-info"></div>
    </div>
  </el-card>
</template>
<script>
import * as THREE from 'three'
import * as maptalks from 'maptalks'
import { ThreeLayer, BaseObject } from 'maptalks.three'
import { E3Layer } from 'maptalks.e3'
import borderJsonData from '@/assets/data/hc_border.json'
import regionJsonData from '@/assets/data/hc_region.json'
import facula from '@/assets/data/facula.png'
import beam from '@/assets/data/beam.png'
class LightPillar extends BaseObject {
  constructor(coordinate, options, layer) {
    options = maptalks.Util.extend({}, {
      altitude: 0,
      width: 20,
      height: 200,
      chunk: 2,
      imgUrl: beam,
      color: 0x44ffaa,
      showParticles: true,
      particlesAmount: 10,
      particlesSize: 4,
      particlesSpeed: 0.05
    }, options, { layer, coordinate })
    super()
    this._initOptions(options)
    const { altitude, width, height, chunk, imgUrl, color, showParticles, particlesSize } = options

    const geometry = new THREE.PlaneGeometry(width, height)
    geometry.rotateX(Math.PI / 2)
    geometry.translate(0, 0, height / 2)
    const textureLoader = new THREE.TextureLoader()
    const material = new THREE.MeshBasicMaterial({
      map: textureLoader.load(imgUrl),
      color: color,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false
    })
    this._createGroup()
    const mesh = new THREE.Mesh(geometry, material)
    for (let i = 0; i < chunk; i++) {
      this.getObject3d().add(mesh.clone().rotateZ(Math.PI * i / chunk))
    }
    const z = layer.distanceToVector3(altitude, altitude).x
    const position = layer.coordinateToVector3(coordinate, z)
    this.getObject3d().position.copy(position)
    if (showParticles) {
      this.particlesCloud = this.createParticles(particlesSize, true, 0.8, true, true, 0xffffff)
      this.getObject3d().add(this.particlesCloud)
    }
  }
  createParticles(size, transparent, opacity, vertexColors, sizeAttenuation, color) {
    const geom = new THREE.BufferGeometry()
    const material = new THREE.PointsMaterial({
      size: size,
      transparent: transparent,
      opacity: opacity,
      vertexColors: vertexColors,
      sizeAttenuation: sizeAttenuation,
      color: color,
      map: new THREE.TextureLoader().load(facula),
      depthTest: false
    })
    let { width } = this.options
    const { height, particlesAmount, particlesSpeed } = this.options
    width *= 0.70710678118655
    const veticsFloat32Array = []
    const veticsColors = []
    this.particlesSpeedList = []
    for (let i = 0; i < particlesAmount; i++) {
      veticsFloat32Array.push(Math.random() * width - width / 2, Math.random() * width - width / 2, Math.random() * height)
      this.particlesSpeedList.push(particlesSpeed + Math.random() / 5)
      const randomColor = new THREE.Color('hsl(0,0%,' + Math.ceil(100 * (Math.random() * 0.5 + 0.5)) + '%)')
      veticsColors.push(randomColor.r, randomColor.g, randomColor.b)
    }
    geom.attributes.position = new THREE.Float32BufferAttribute(veticsFloat32Array, 3)
    geom.attributes.color = new THREE.Float32BufferAttribute(veticsColors, 3)
    const particlesCloud = new THREE.Points(geom, material)
    particlesCloud.verticesNeedUpdate = true
    return particlesCloud
  }
  _animation() {
    const height = this.options.height
    const positionArray = Array.from(this.particlesCloud.geometry.attributes.position.array)
    for (let i = 0; i < positionArray.length; i += 3) {
      positionArray[i + 2] += this.particlesSpeedList[i / 3]
      if (positionArray[i + 2] > height) {
        positionArray[i + 2] = 0
      }
    }
    this.particlesCloud.geometry.setAttribute('position', new THREE.Float32BufferAttribute(positionArray, 3))
  }
}
export default {
  name: 'MapView',
  data() {
    return {
      mapCenter: [122.12456, 37.40352],
      centerSite: [122.09896, 37.49856], // [122.07887, 37.45754],
      mapDom: null,
      currentFeature: null,
      globalBorder: null,
      regionPolygons: [],
      geoCoordMap: {},
      timeList: [],
      tableData: [],
      carouselIndex: 0,
      dataTimer: null
    }
  },
  mounted() {
    const now = new Date()
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    this.timeList = [start, end]
    this.$nextTick(() => {
      this.initMapTalk()
      this.initBorderData()
      this.initRegionData()
      this.drawE3LayerDataToGlobal()
      this.loadData()
    })
  },
  destroyed() {
    if (this.dataTimer) {
      clearInterval(this.dataTimer)
      this.dataTimer = null
    }
  },
  methods: {
    loadData() {
      this.tableList = []
      this.$post({
        url: this.$urlPath.showAlarm,
        data: {
          startDate: this.getDateTime(this.timeList[0]),
          endDate: this.getDateTime(this.timeList[1])
        }
      }).then((res) => {
        this.tableData = res.alarmInfoList || []
        const infoDom = document.getElementById('info')
        if (this.tableData.length) {
          this.setCarouselInfo()
          this.dataTimer = setInterval(() => {
            this.setCarouselInfo()
          }, 1000 * 5)
        } else {
          infoDom.innerHTML = `今日暂无光功率设备报警！`
        }
      })
    },
    initMapTalk() {
      const baseTitle = new maptalks.TileLayer('baseTitle', {
        subdomains: ['01', '02', '03', '04'],
        cssFilter: 'sepia(75%) invert(90%) grayscale(100%)',
        visible: false,
        forceRenderOnMoving: true,
        forceRenderOnZooming: true,
        forceRenderOnRotating: true
      })
      baseTitle.getTileUrl = (a, b, c) => {
        const flag = '00000000'
        const z = 'L' + c
        const xx = a.toString(16)
        const x = 'C' + flag.substring(0, 8 - xx.length) + xx
        const yy = b.toString(16)
        const y = 'R' + flag.substring(0, 8 - yy.length) + yy
        return 'http://10.253.183.170/gismap/alllayers/' + z + '/' + y + '/' + x + '.png'
      }
      this.mapDom = new maptalks.Map('mapDom', {
        center: this.mapCenter,
        zoom: 11.4,
        spatialReference: {
          projection: 'EPSG:3857'
        },
        pitch: 30,
        dragRotate: false,
        attribution: false,
        baseLayer: new maptalks.VectorLayer('baseVector'),
        layers: [
          baseTitle,
          new maptalks.VectorLayer('regionBorder', {
            forceRenderOnMoving: true,
            forceRenderOnZooming: true,
            forceRenderOnRotating: true,
            enableAltitude: true,
            zIndex: -99,
            drawAltitude: {
              polygonFill: 'rgba(30,144,255,1)',
              polygonOpacity: 0.35,
              lineWidth: 0
            }
          }),
          new maptalks.VectorLayer('regionPolygon', {
            enableAltitude: true,
            forceRenderOnMoving: true,
            forceRenderOnZooming: true,
            forceRenderOnRotating: true
          })
        ]
      })
      this.mapDom.on('click', param => {
        const infoDom = document.getElementById('info')
        infoDom.innerHTML = `坐标：${param.coordinate.toFixed(5).toArray().join(',')}，缩放：${this.mapDom.getZoom().toFixed(1)}，中心点：${[this.mapDom.getCenter().x.toFixed(5), this.mapDom.getCenter().y.toFixed(5)].join()}，倾斜：${this.mapDom.getPitch().toFixed(1)}`
      })

      const threeLayer = new ThreeLayer('three', {
        forceRenderOnMoving: true,
        forceRenderOnRotating: true,
        animation: true
      })
      threeLayer.prepareToDraw = function (gl, scene, camera) {
        const light = new THREE.DirectionalLight(0xffffff)
        light.position.set(0, -10, 10).normalize()
        scene.add(light)
        animation()
      }
      threeLayer.addTo(this.mapDom)
      function animation() {
        if (threeLayer._needsUpdate) {
          threeLayer.renderScene()
        }
        requestAnimationFrame(animation)
      }
    },
    initBorderData() {
      const borderFeatures = borderJsonData.features[0]
      const feature = new maptalks.MultiPolygon(borderFeatures.geometry.coordinates, {
        properties: borderFeatures.properties
      })
      this.globalBorder = feature
      let mask = this.mapDom.getLayer('baseTitle').getMask()
      if (!mask) {
        mask = new maptalks.MultiPolygon(feature.getCoordinates())
        // this.mapDom.getLayer('baseTitle').setMask(mask)
        this.mapDom.getLayer('baseTitle').setMask(mask).show()
      } else {
        mask.setCoordinates(feature.getCoordinates())
      }
      this.getBorderLinesFeature(
        feature.getCoordinates().map(d => {
          return d[0]
        }),
        feature.properties
      ).addTo(this.mapDom.getLayer('regionBorder'))
      mask.copy().setSymbol({
        shadowBlur: 35,
        lineColor: '#000',
        lineWidth: 10,
        lineJoin: 'round',
        polygonFillOpacity: 0
      }).addTo(this.mapDom.getLayer('baseVector'))
    },
    getBorderLinesFeature(coordinates, properties) {
      return new maptalks.MultiLineString(coordinates, {
        symbol: {
          lineColor: 'rgba(30,144,255,1)',
          lineWidth: 1,
          textPlacement: 'vertex'
        },
        properties: {
          altitude: -70,
          id: properties.id,
          properties: properties
        }
      })
    },
    initRegionPolygons(idx, coordinates, properties) {
      const polygon = new maptalks.MultiPolygon(coordinates, {
        symbol: {
          lineWidth: 1,
          lineColor: 'rgba(70,133,180,0.6)',
          polygonFill: 'rgba(135,206,250,0.1)',
          polygonOpacity: 0.5
        },
        properties: {
          altitude: 10,
          id: properties.adcode,
          properties: properties
        }
      }).on('dblclick', e => {
        console.log(e.target)
        return false
      })
      this.regionPolygons.push(polygon)
    },
    initRegionData() {
      regionJsonData.features.forEach((g, i) => {
        const properties = g.properties
        const coordinates = g.geometry.coordinates
        this.initRegionPolygons(i, coordinates, properties)
        this.geoCoordMap[properties.name] = properties.centroid
      })
      this.mapDom.getLayer('regionPolygon').addGeometry(this.regionPolygons)
    },
    drawE3LayerDataToGlobal() {
      const dataArr = []; let upsArr = []; const upsNormalArr = []; const upsErrorArr = []
      const lastUPSDataList = localStorage.getItem('lastUPSDataList')
      if (lastUPSDataList) {
        const lastUPSDataListArr = JSON.parse(lastUPSDataList)
        upsArr = lastUPSDataListArr.filter(item => {
          return item.coords && item.coords.length && item.coords[0] && item.coords[1]
        })
        upsArr.forEach(item => {
          dataArr.push({
            coords: [item.coords, this.centerSite]
          })
          item.value = item.coords.concat(10)
          if (item.vh || item.vl || item.vi || item.vo) {
            upsErrorArr.push(item)
          } else {
            upsNormalArr.push(item)
          }
        })
      }

      const option = {
        tooltip: {
          trigger: 'item',
          formatter(params) {
            if (params.data) {
              return `<div style="color:#909399;font-size:12px"><span style="color:#e54d42"> ${params.name} </span> 数据中继点</div>`
            }
            return ''
          },
          borderColor: '#ffa022'
        },
        series: [
          {
            name: 'porCenter',
            type: 'effectScatter',
            coordinateSystem: 'geo',
            data: [{
              name: '中心机房',
              value: this.centerSite.concat(46)
            }],
            symbolSize: 15,
            rippleEffect: {
              scale: 3,
              brushType: 'stroke'
            },
            label: {
              formatter: '{b}',
              distance: 24,
              fontSize: 16,
              position: 'top',
              backgroundColor: 'rgba(0,23,11,0.8)',
              color: '#FFF8DC',
              borderRadius: 8,
              borderColor: '#ffa022',
              borderWidth: 1,
              padding: [4, 8, 2, 8],
              show: true
            },
            labelLine: {
              show: true
            },
            itemStyle: {
              color: '#ffa022'
            },
            emphasis: {
              scale: false
            },
            tooltip: {
              formatter(params) {
                if (params.data) {
                  return `<div style="color:#909399;font-size:12px">中心机房网管在线 <span style="color:#e54d42"> ${params.value[2]} </span> 台</div>`
                }
                return ''
              },
              borderColor: '#ffa022'
            },
            zlevel: 4
          },
          {
            name: 'porLine',
            type: 'lines',
            effect: {
              show: true,
              constantSpeed: 50,
              trailLength: 0.2,
              color: 'rgba(255,255,255,0.3)',
              symbolSize: 2
            },
            lineStyle: {
              normal: {
                color: '#ffa022',
                width: 0,
                opacity: 0.03,
                curveness: 0.4
              }
            },
            tooltip: {
              show: false
            },
            data: dataArr,
            zlevel: 1
          },
          {
            name: 'upsNorma',
            type: 'effectScatter',
            coordinateSystem: 'geo',
            data: upsNormalArr,
            symbolSize: 3,
            label: {
              formatter: '{b}',
              distance: 10,
              fontSize: 10,
              position: 'top',
              backgroundColor: 'rgba(0,23,11,0.8)',
              color: '#E3E3E3',
              borderRadius: 8,
              borderColor: '#FFDEAD',
              borderWidth: 1,
              padding: [3, 6, 1, 6],
              show: true
            },
            labelLine: {
              show: true
            },
            itemStyle: {
              color: '#FFDEAD'
            },
            emphasis: {
              scale: false
            },
            rippleEffect: {
              scale: 5,
              number: 2,
              period: 3,
              color: 'rgba(255,222,173,0.8)',
              brushType: 'fill'
            },
            tooltip: {
              formatter(params) {
                if (params.data) {
                  return `<div style="color:#909399;font-size:12px">
                            工作状态-<span style="color:#39b54a">正常</span> <br>
                            IP: ${params.data.ip} <br>
                            温度：<span style="color:#39b54a"> ${params.data.heat} </span> ℃<br>
                            负载：<span style="color:#39b54a"> ${params.data.load} </span> %<br>
                            输入：<span style="color:#39b54a"> ${params.data.input} </span> V<br>
                            输出：<span style="color:#39b54a"> ${params.data.output} </span> V<br>
                           </div>`
                }
                return ''
              },
              borderColor: '#ffa022'
            },
            zlevel: 3
          },
          {
            name: 'upsError',
            type: 'effectScatter',
            coordinateSystem: 'geo',
            data: upsErrorArr,
            symbolSize: 3,
            label: {
              formatter: '{b}',
              distance: 10,
              fontSize: 10,
              position: 'top',
              backgroundColor: 'rgba(0,23,11,0.8)',
              color: '#E3E3E3',
              borderRadius: 8,
              borderColor: '#e54d42',
              borderWidth: 1,
              padding: [3, 6, 1, 6],
              show: true
            },
            labelLine: {
              show: true
            },
            itemStyle: {
              color: '#e54d42'
            },
            rippleEffect: {
              scale: 7,
              number: 2,
              period: 3,
              color: 'rgba(255,48,48,0.8)',
              brushType: 'fill'
            },
            emphasis: {
              scale: false
            },
            tooltip: {
              formatter(params) {
                if (params.data) {
                  return `<div style="color:#909399;font-size:12px">
                            工作状态-<span style="color:#e54d42">异常</span> <br>
                            IP: ${params.data.ip} <br>
                            温度：<span style="color:${params.data.vh ? '#e54d42' : '#39b54a'}"> ${params.data.heat} </span> ℃<br>
                            负载：<span style="color:${params.data.vl ? '#e54d42' : '#39b54a'}"> ${params.data.load} </span> %<br>
                            输入：<span style="color:${params.data.vi ? '#e54d42' : '#39b54a'}"> ${params.data.input} </span> V<br>
                            输出：<span style="color:${params.data.vo ? '#e54d42' : '#39b54a'}"> ${params.data.output} </span> V<br>
                           </div>`
                }
                return ''
              },
              borderColor: '#ffa022'
            },
            zlevel: 3
          }
        ]
      }
      const e3Layer = new E3Layer('e3', option).addTo(this.mapDom)
      e3Layer.getEChartsInstance().on('mouseover', obj => {
        if (obj.seriesType === 'effectScatter') {
          if (!this.currentFeature) {
            this.currentFeature = this.findFeatureByName(obj.name)
            this.currentFeature.updateSymbol({
              polygonFill: 'rgba(135,206,250,0.9)'
            })
          } else if (this.currentFeature.properties.properties.name !== obj.name) {
            this.currentFeature.updateSymbol({
              polygonFill: 'rgba(135,206,250,0.1)'
            })
            this.currentFeature = this.findFeatureByName(obj.name)
            this.currentFeature.updateSymbol({
              polygonFill: 'rgba(135,206,250,0.9)'
            })
          }
        }
      }).on('mouseout', obj => {
        if (obj.seriesType === 'effectScatter' && this.currentFeature) {
          this.currentFeature.updateSymbol({
            polygonFill: 'rgba(135,206,250,0.1)'
          })
          this.currentFeature = null
        }
      })

      setTimeout(() => {
        this.drawThreeLayerData(upsErrorArr)
      }, 1500)
    },
    drawThreeLayerData(cObjArr) {
      const threeLayer = this.mapDom.getLayer('three')
      cObjArr.forEach(item => {
        threeLayer.addMesh(new LightPillar(new maptalks.Coordinate(item.coords), {
          minZoom: 6,
          maxZoom: 12,
          width: 15,
          height: Math.ceil(70 * Math.random()) + 30,
          color: '#e54d42'
        }, threeLayer))
      })
    },
    findFeatureByName(name) {
      for (let i = 0; i < this.regionPolygons.length; i++) {
        const item = this.regionPolygons[i]
        if (item.properties.properties.name === name) {
          return item
        }
      }
    },
    getDateTime(now) {
      if (!now) {
        now = new Date()
      }
      return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`
    },
    setCarouselInfo() {
      const infoObj = this.tableData[this.carouselIndex % this.tableData.length]
      this.carouselIndex++
      const infoDom = document.getElementById('info')
      infoDom.innerHTML = `${infoObj.datetime} <span style="color:#d3d3d3"> 设备IP: </span> ${infoObj.machine} <span style="color:#d3d3d3"> 发生了 </span> ${infoObj.description}`
    }
  }
}
</script>

<style lang="scss" scoped>
.chart-item-container {
  width: 100%;
  height: calc(215px * 3 + 15px);
  .chart-item {
    height: calc(205px * 3 + 8px);
    position: relative;
  }
}

.map-container {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
}
.map-info {
  position: absolute;
  background-color: rgba(13, 13, 13, 0.5);
  padding: 0 10px;
  left: 0;
  top: 0;
  width: 100%;
  height: 16px;
  overflow: hidden;
  text-align: center;
  font: 16px bold sans-serif;
  line-height: 16px;
  color: #fff;
}
</style>
