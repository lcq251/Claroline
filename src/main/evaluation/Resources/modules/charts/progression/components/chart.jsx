import React from 'react'
import {Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts'

import {trans} from '#/main/app/intl'
import {CountGauge} from '#/main/core/layout/gauge/components/count-gauge'

const data = [
  {
    name: '0-10%',
    progression: 4000,
    score: 2400,
    //amt: 2400,
  }, {
    name: '10-20%',
    progression: 3000,
    score: 1398,
    //amt: 2210,
  }, {
    name: '20-30%',
    progression: 2000,
    score: 9800,
    //amt: 2290,
  }, {
    name: '30-40%',
    progression: 2780,
    score: 3908,
    //amt: 2000,
  }, {
    name: '40-50%',
    progression: 1890,
    score: 4800,
    //amt: 2181,
  }, {
    name: '50-60%',
    progression: 2390,
    score: 3800,
    //amt: 2500,
  }, {
    name: '60-70%',
    progression: 3490,
    score: 4300,
    //amt: 2100,
  }, {
    name: '70-80%',
    progression: 3490,
    score: 4300,
    //amt: 2100,
  }, {
    name: '80-90%',
    progression: 3490,
    score: 4300,
    //amt: 2100,
  }, {
    name: '90-100%',
    progression: 3490,
    score: 4300,
    //amt: 2100,
  }
]

const ProgressionChart = (props) => {
  return (
    <div className="row">
      <div className="col-3">
        <CountGauge
          value={27}
          total={100}
          type="warning"
          displayValue={(value) => value + '%'}
          width={120}
          height={120}
        />
      </div>
      <div className="col-9">
        <ResponsiveContainer width="100%" height={240}>
          <BarChart
            /*width={500}
            height={300}*/
            data={data}
            /*margin={{
              top: 20,
              right: 0,
              left: 20,
              bottom: 0
            }}*/
          >
            <CartesianGrid vertical={false} strokeDasharray="5 5" stroke="var(--bs-secondary)" strokeOpacity={.5} strokeWidth={1} shapeRendering="crispEdges" />

            <XAxis dataKey="name" stroke="var(--bs-secondary)" shapeRendering="crispEdges" strokeOpacity={1} />
            <YAxis stroke="var(--bs-secondary)" shapeRendering="crispEdges" strokeOpacity={1}/>

            <Tooltip />
            {/*<Legend />*/}

            <Bar
              barSize={18}
              /*shapeRendering="crispEdges"*/
              dataKey="progression"
              fill="var(--bs-primary)"
              /*activeBar={<Rectangle fill="var(--bs-primary-text-emphasis)" />}*/
              label={trans('progression', {}, 'evaluation')}
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export {
  ProgressionChart
}
