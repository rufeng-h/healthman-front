<template>
  <Card title="各科目成绩分布" :loading="loading">
    <div ref="chartRef" :style="{ width, height }"></div>
  </Card>
</template>
<script lang="ts">
  import { Ref } from 'vue';

  import { defineComponent, ref, watch } from 'vue';
  import { Card } from 'ant-design-vue';
  import { useECharts } from '/@/hooks/web/useECharts';
  import { StuMeasurementDetailModel } from '/@/api/measurement';

  export default defineComponent({
    components: { Card },
    props: {
      loading: {
        type: Boolean,
      },
      width: {
        type: String,
        default: '100%',
      },
      height: {
        type: String,
        default: '15rem',
      },
      stuMs: {
        type: Object as PropType<StuMeasurementDetailModel>,
        required: true,
      },
    },
    setup(props) {
      const chartRef = ref<HTMLDivElement | null>(null);
      const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>);

      const indicator: any = [];
      const value: number[] = [];
      const subNames = new Set();
      props.stuMs.scores.forEach((s) => {
        if (s.scoLevel === undefined || subNames.has(s.subName)) {
          return;
        }
        indicator.push({
          name: s.subName,
          max: 100,
          min: 0,
        });
        value.push(s.score as number);
        subNames.add(s.subName);
      });
      const radarName = '成绩分布';
      const data = [
        {
          name: radarName,
          value,
        },
      ];
      console.log(data);
      watch(
        () => props.loading,
        () => {
          if (props.loading) {
            return;
          }
          setOptions({
            legend: {
              bottom: 0,
              data: [radarName],
            },
            tooltip: {},
            radar: {
              radius: '80%',
              center: ['50%', '50%'],
              splitNumber: 8,
              indicator,
            },
            series: [
              {
                type: 'radar',
                symbolSize: 0,
                areaStyle: {
                  shadowBlur: 0,
                  shadowColor: 'rgba(0,0,0,.2)',
                  shadowOffsetX: 0,
                  shadowOffsetY: 10,
                  opacity: 1,
                },
                data,
                // data: [
                //   {
                //     value: [90, 50, 86, 40, 50, 20],
                //     name: 'Visits',
                //     itemStyle: {
                //       color: '#9f8ed7',
                //     },
                //   },
                //   {
                //     value: [70, 75, 70, 76, 20, 85],
                //     name: 'Sales',
                //     itemStyle: {
                //       color: '#1edec5',
                //     },
                //   },
                // ],
              },
            ],
          });
        },
        { immediate: true },
      );
      return { chartRef };
    },
  });
</script>
