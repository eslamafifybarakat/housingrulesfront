export const stackedOptions = {
  responsive: true,
  plugins: {
    responsive: true,
    legend: {
      labels: {
        color: '#111',
      },
    },
    datalabels: {
      color: '#fff',
      textAlign: 'center',
      display: function (context: any) {
        return context.dataset.data[context.dataIndex] !== 0; // or >= 1 or ...
      },
    },
    tooltips: {
      mode: 'index',
      intersect: false,
    },
  },
  scales: {
    x: {
      stacked: true,
      ticks: {
        color: '#111',
        font: {
          size: 12,
          weight: 'bold',
        },
      },
      grid: {
        color: '#eee',
      },
    },
    y: {
      // max: 160,
      // min: 0,
      stacked: true,
      ticks: {
        color: '#111',
        stepSize: 5,
      },
      grid: {
        color: '#eee',
      },
    },
  },
};

export const barStackedOptions = {
  plugins: {
    responsive: true,
    legend: {
      labels: {
        color: '#111',
      },
    },
    datalabels: {
      color: '#fff',
      textAlign: 'center',
      display: function (context: any) {
        return context.dataset.data[context.dataIndex] !== 0;
      },
    },
    tooltips: {
      mode: 'index',
      intersect: false,
    },
  },
  scales: {
    x: {
      stacked: true,
      ticks: {
        color: '#111',
        font: {
          size: 13,
          weight: 'bold',
          family: 'sans-serif',
        },
      },
      grid: {
        color: '#eeef',
      },
    },
    y: {
      stacked: true,
      ticks: {
        color: '#111',
        stepSize: 5,
      },
      grid: {
        color: '#eeef',
      },
    },
  },
};

export const stackedOptionsHorizontal = {
  indexAxis: 'y',
  plugins: {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      labels: {
        color: '#1110',
      },
    },
    datalabels: {
      color: '#fff0',
      display: function (context: any) {
        return context.dataset.data[context.dataIndex] !== 0; // or >= 1 or ...
      },
    },
    tooltips: {
      mode: 'index',
      intersect: false,
    },
  },
  scales: {
    x: {
      stacked: true,
      ticks: {
        color: '#1110',
        font: {
          size: 12,
          weight: 'bold',
        },
      },
      grid: {
        color: 'rgba(255,255,255,0.5)',
      },
    },
    y: {
      stacked: true,
      ticks: {
        color: '#1110',
        font: {
          size: 12,
          weight: 'bold',
        },
      },
      grid: {
        color: 'rgba(255,255,255,0.5)',
      },
    },
  },
};

export const doughnutChartOptions = {
  plugins: {
    legend: {
      position: 'top',
      labels: {
        color: '#495057',
      },
    },
    datalabels: {
      textAlign: 'center',
      color: 'white',
      font: {
        weight: 'bold',
      },
      display: function (context: any) {
        return context.dataset.data[context.dataIndex] !== 0; // or >= 1 or ...
      },
    },
  },
};

export const polarAreaChartOptions = {
  plugins: {
    legend: {
      labels: {
        color: '#495057',
      },
    },
    datalabels: {
      color: '#111',
    },
  },
  scales: {
    r: {
      grid: {
        color: '#ebedef',
      },
    },
  },
};

export const pieChartOptions = {
  plugins: {
    legend: {
      position: 'top',
    },
    datalabels: {
      color: 'white',
      font: {
        weight: 'bold',
      },
      display: function (context: any) {
        return context.dataset.data[context.dataIndex] !== 0; // or >= 1 or ...
      },
    },
  },
  scales: {
    x: {
      display: false,
      ticks: {
        color: '#111',
      },
      grid: {
        display: false,
      },
    },
    y: {
      display: false,
      ticks: {
        color: '#111',
        stepSize: 5,
      },
      grid: {
        display: false,
      },
    },
  },
};

export const basicOptions = {
  plugins: {
    responsive: true,

    legend: {
      labels: {
        color: '#111',
      },
    },
    datalabels: {
      color: '#111',
      textAlign: 'center',
    },
  },
  scales: {
    x: {
      stacked: true,
      ticks: {
        color: '#111',
        font: {
          size: 10,
        },
      },
      grid: {
        color: '#eee',
      },
    },
    y: {
      stacked: true,
      ticks: {
        color: '#111',
        stepSize: 5,
      },
      grid: {
        color: '#eee',
      },
    },
  },
};

export const basicOptionsHorizontal = {
  indexAxis: 'y',
  plugins: {
    responsive: true,

    legend: {
      labels: {
        color: '#111',
      },
    },
    datalabels: {
      color: '#111',
      display: function (context: any) {
        return context.dataset.data[context.dataIndex] !== 0; // or >= 1 or ...
      },
    },
  },
  scales: {
    x: {
      ticks: {
        color: '#1110',
        font: {
          size: 10,
        },
      },
      grid: {
        color: '#eee0',
      },
    },
    y: {
      ticks: {
        color: '#1110',
        stepSize: 5,
      },
      grid: {
        color: '#eee0',
      },
    },
  },
};
