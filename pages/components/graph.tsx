import Head from 'next/head';
import styles from '../../styles/Home.module.css';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';


import { Option } from '../../interfaces/interfaces'


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  indexAxis: 'y' as const,
  updateMode:"resize",
  animation:false,
  responsive: true,
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  plugins: {
    legend: {
      position: 'right' as const,
      display:false
    },
    title: {
      display: false,
      text: 'Chart.js Horizontal Bar Chart',
    },
  },
};


export default function Graph(props:any) {

  const labels = props.options.map((option:Option)=>{
    return option.text
  })

  const votesData = props.options.map((option:Option)=>{
    return option.votes
  })

  const data = {
    labels,
    datasets: [
      {
        label: 'Votes',
        data: votesData,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132,1)',
      }
    ],
  };
  
  const graphData = props.options.map((option:Option)=>{
   
  })

  return (
            <div>
               <Bar options={options} data={data} />;
            </div>
    )
}
