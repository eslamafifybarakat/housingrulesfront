
export const stackedOptions = {
  plugins: {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      labels: {
        color: '#111',
      }
    },
    tooltips: {
      mode: 'index',
      intersect: false
    }
  },
  scales: {
    x: {
      stacked: true,
      ticks: {
        color: '#111'
      },
      grid: {
        color: '#eee',

      }
    },
    y: {
      // max: 160,
      // min: 0,
      stacked: true,
      ticks: {
        color: '#111',
        stepSize: 4,
      },
      grid: {
        color: '#eee',
      },

    }
  }
};
export const stackedOptionsHorizontal = {
  indexAxis: 'y',
  plugins: {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      labels: {
        color: '#111',
      }
    },
    tooltips: {
      mode: 'index',
      intersect: false
    }
  },
  scales: {
    x: {
      stacked: true,
      ticks: {
        color: '#111'
      },
      grid: {
        color: '#eee',

      }
    },
    y: {
      // max: 160,
      // min: 0,
      stacked: true,
      ticks: {
        color: '#111',
        stepSize: 4,
      },
      grid: {
        color: '#eee',
      },

    }
  }
};
export const doughnutChartOptions = {
  plugins: {
    legend: {
      labels: {
        color: '#495057'
      }
    }
  }
}

export const polarAreaChartOptions = {
  plugins: {
    legend: {
      labels: {
        color: '#495057'
      }
    }
  },
  scales: {
    r: {
      grid: {
        color: '#ebedef'
      }
    }
  }

}

export const basicOptions = {
  plugins: {
    responsive: true,

    legend: {
      labels: {
        color: '#111'
      }
    }
  },
  scales: {
    x: {
      ticks: {
        color: '#111',
      },
      grid: {
        color: '#eee'
      }
    },
    y: {
      ticks: {
        color: '#111',
        stepSize: 5,
      },
      grid: {
        color: '#eee',
      }
    }
  }
};
export const basicOptionsHorizontal = {
  indexAxis: 'y',
  plugins: {
    responsive: true,

    legend: {
      labels: {
        color: '#111'
      }
    }
  },
  scales: {
    x: {
      ticks: {
        color: '#111',
      },
      grid: {
        color: '#eee'
      }
    },
    y: {
      ticks: {
        color: '#111',
        stepSize: 5,
      },
      grid: {
        color: '#eee',
      }
    }
  }
};
