<template>
  <div class="w-full h-full">
    <div ref="chartRef" :style="{ height, width }"></div>
  </div>
</template>
<script lang="ts">
  import { defineComponent, onMounted, Ref, ref, toRefs } from 'vue';
  import { listOper, OperationModel } from '/@/api/operation';
  import { useECharts } from '/@/hooks/web/useECharts';
  import { TreeChart } from 'echarts/charts';
  interface Item {
    name: string;
    children: Item[];
  }
  export default defineComponent({
    props: {
      width: {
        type: String as PropType<string>,
        default: '100%',
      },
      height: {
        type: String as PropType<string>,
        default: '40rem',
      },
    },
    setup(props) {
      let data: any = [];
      const chartRef = ref<HTMLDivElement | null>(null);
      const { setOptions, echarts } = useECharts(chartRef as Ref<HTMLDivElement>);

      echarts.use([TreeChart]);
      onMounted(async () => {
        data = await listOper();

        const map: Recordable<OperationModel & Item> = {};
        data.sort((a, b) => a.operId - b.operId);
        data.forEach((o) => {
          o.name = o.operSummary;
          o.children = [];
          map[o.operId] = o;
          if (o.pid !== 0) {
            //@ts-ignore
            map[o.pid]?.children.push(o);
          }
        });
        data = Object.values(map).filter((o) => o.pid === 0);

        setOptions({
          tooltip: {
            trigger: 'item',
            triggerOn: 'mousemove',
          },
          series: [
            {
              left: '1%',
              top: '3%',
              right: '1%',
              bottom: '7%',
              type: 'tree',
              data: [{ name: '系统权限', children: data }],
              symbolSize: 20,
              symbol: 'image:///src/assets/icons/microsoftauthenticator.svg',
              orient: 'vertical',
              expandAndCollapse: true,
              initialTreeDepth: -1,
              label: {
                rotate: 40,
                position: 'bottom',
              },
              lineStyle: {
                width: 1.5,
                shadowColor: '#0960bd',
                shadowBlur: 2,
                shadowOffsetX: 1,
                shadowOffsetY: 1,
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#0960bd' },
                  { offset: 1, color: '#43eec6' },
                ]),
              },
              emphasis: {
                focus: 'descendant',
                lineStyle: {
                  shadowColor: '#00f',
                  shadowBlur: 1,
                  shadowOffsetX: 2,
                  shadowOffsetY: 2,
                },
              },
            },
          ],
        });
      });
      return { chartRef, ...toRefs(props) };
    },
  });
</script>
