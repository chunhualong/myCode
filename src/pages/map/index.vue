<template>
  <map :show-location="true" name="map" :markers="markers" :longitude="longitude" :latitude="latitude" style="width: 100%; height: 100%;"></map>
</template>

<script>
  export default {
    data () {
      return {
        longitude: 0,
        latitude: 0
      }
    },
    mounted () {
      wx.getLocation({
        type: 'wgs84',
        success: (res) => {
          console.log(res)
          this.longitude = res.longitude
          this.latitude = res.latitude
        }
      })
    }
  }
</script>

<style scoped>

</style>
