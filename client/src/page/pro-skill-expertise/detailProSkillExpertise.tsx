// detailProSkillExpertise.tsx
import { Card, Form, Select, Space, Typography, Cascader, Button, Row, Col, Spin, Input, Radio, Modal } from 'antd';
import ModalPopup from '../../common/ModalPopup';
import { useEffect, useState, useReducer, useRef, useCallback, useMemo } from 'react';
import { MetaModal } from '../../model/MetalModel';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MainButton } from '../../common/MainButton';
import PopupPdfDetail from './component/popupPdfDetail';
import InfomationEmployee from '../../views/admin-evaluation/pro-skill-expertise/InfomationEmployee';
import evaluatorApiService from '../../common/api/evaluator';
import styles from '../../common/css/stylesTable.module.css';
import { ArrowUpOutlined, MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { professionalExpertise } from '../../types/api/proSkillSetting';
import { Bar, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Filler,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  ChartOptions,
  ChartEvent,
  ActiveElement,
} from 'chart.js';
import PdfFileProfessional from './PdfFileProfessional';
import { useReactToPrint } from 'react-to-print';
import { transformCategories } from '../../common/util';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

interface stateReducer {
  jobType: professionalExpertise[];
  numberGroupPageChart: {
    number: number;
    index: number;
    modeLarge: number;
  }[];
  fontSizeGroup: { fontSize: number; index: number }[];
  stateGroupMediumClass: { value: string; label: string; children: any[] }[][];
  groupMediumClasses: { value: string; label: string }[] | any[];
  groupLargeClasses: { value: string; label: string }[] | any[];
  listGroupDelete: { [x: string]: string }[];
}
const initialState: stateReducer = {
  jobType: [],
  numberGroupPageChart: [],
  fontSizeGroup: [],
  stateGroupMediumClass: [],
  groupMediumClasses: [],
  groupLargeClasses: [],
  listGroupDelete: [],
};
type Action =
  | { type: 'SET_JOB_TYPE'; payload: professionalExpertise[] }
  | {
      type: 'SET_NUMBER_GROUP_PAGE_CHART';
      payload: {
        number: number;
        index: number;
        modeLarge: number;
      }[];
    }
  | { type: 'SET_FONT_SIZE_GROUP'; payload: { fontSize: number; index: number }[] }
  | {
      type: 'SET_GROUP_MEDIUM_CLASS';
      payload: { value: string; label: string; children: any[] }[][];
    }
  | {
      type: 'SET_MEDIUM_CLASS_DEFAULT';
      payload: { [x: string]: string }[];
    }
  | {
      type: 'SET_LARGE_CLASS_DEFAULT';
      payload: { [x: string]: string }[];
    }
  | {
      type: 'SET_LIST_DELETE_CLASSFICATION';
      payload: { [x: string]: string }[];
    };

const reducer = (state: stateReducer, action: Action) => {
  switch (action.type) {
    case 'SET_JOB_TYPE':
      return {
        ...state,
        jobType: action.payload,
      };
    case 'SET_NUMBER_GROUP_PAGE_CHART':
      return {
        ...state,
        numberGroupPageChart: action.payload,
      };
    case 'SET_FONT_SIZE_GROUP':
      return {
        ...state,
        fontSizeGroup: action.payload,
      };
    case 'SET_GROUP_MEDIUM_CLASS':
      return {
        ...state,
        stateGroupMediumClass: action.payload,
      };
    case 'SET_MEDIUM_CLASS_DEFAULT':
      return {
        ...state,
        groupMediumClasses: action.payload,
      };
    case 'SET_LARGE_CLASS_DEFAULT':
      return {
        ...state,
        groupLargeClasses: action.payload,
      };
    case 'SET_LIST_DELETE_CLASSFICATION':
      return {
        ...state,
        listGroupDelete: action.payload,
      };
    default:
      return state;
  }
};
// Props data
type dataSets = {
  label: string;
  data: number[];
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  fill: boolean;
  pointBackgroundColor: string;
  pointBorderColor: string;
  pointHoverBackgroundColor: string;
  pointHoverBorderColor: string;
  hidden: boolean;
  barThickness: number;
};
const DetailProSkillExpertise = () => {
  const [isOutputPDF, setOutputPDF] = useState(false);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [stateGroups, setStateGroup] = useState<any[]>([]);
  const [metaModal, setMetaModal] = useState({
    type: '',
    record: {},
    title: '',
    isOpen: false,
  } as MetaModal);
  const [pdfModal, setPdfModal] = useState({
    isOpen: false,
  });

  const handleOpenPDFDetail = () => {
    setMetaModal({
      ...metaModal,
      isOpen: true,
      title: t('IDS_PDF_DETAIL_EVALUATION_EXPERTISE'),
    });
  };
  const componentRef = useRef(null) as any;
  const handleCancelPDFDetail = () => {
    setMetaModal({ ...metaModal, isOpen: false });
  };
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation().state;
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [listJobTypes, setListJobTypes] = useState<string[]>([]);
  const navigate = useNavigate();
  const params = useParams();

  const [renderedChartCount, setRenderedChartCount] = useState(0); // Thêm state để đếm số biểu đồ đã render

  // Hàm này sẽ được gọi mỗi khi một biểu đồ trong PdfFileProfessional hoàn tất render
  const handleChartRender = useCallback(() => {
    setRenderedChartCount((prevCount) => {
      return prevCount + 1;
    });
  }, []);

  // Tổng số biểu đồ dự kiến sẽ render trong PdfFileProfessional
  const totalExpectedCharts = useMemo(() => {
    let count = 0;
    if (state.jobType && state.jobType.length > 0) {
      state.jobType.forEach((v) => {
        if (v.childrens && v.childrens.length > 0) {
          count += 1; // Bar chart for jobType summary
        }
        const mode: any = state.numberGroupPageChart.find((chartMode) => chartMode.index === state.jobType.indexOf(v));
        const currentJobTypeResults: any[] = [];
        if (state.numberGroupPageChart.length === 0 || !mode) {
          const classifications = v.childrenLarge.reduce((acc: Record<string, any>, curr: any) => {
            if (!acc[`${curr.year}-${curr.periodIndex}`]) {
              acc[`${curr.year}-${curr.periodIndex}`] = {
                year: curr.year,
                periodIndex: curr.periodIndex,
                childrens: [],
              };
            }
            acc[`${curr.year}-${curr.periodIndex}`].childrens.push({
              name: curr.largeClass,
              totalPoint: curr.totalPoint || 0,
              year: curr.year,
              periodIndex: curr.periodIndex,
            });

            return acc;
          }, {});
          currentJobTypeResults.push(Object.values(classifications));
        } else {
          const mergeYearPeriodMediumClassfications: any = {};
          const large = v.childrenLarge.reduce((acc: Record<string, any>, curr: any) => {
            if (!acc[`${curr.year}-${curr.periodIndex}`]) {
              acc[`${curr.year}-${curr.periodIndex}`] = {
                year: curr.year,
                periodIndex: curr.periodIndex,
                childrens: [],
              };
            }
            acc[`${curr.year}-${curr.periodIndex}`].childrens.push({
              name: curr.largeClass,
              totalPoint: curr.totalPoint || 0,
              year: curr.year,
              periodIndex: curr.periodIndex,
            });

            return acc;
          }, {});
          const medium = v.childrenMedium.reduce((acc: Record<string, any>, curr: any) => {
            if (!acc[`${curr.year}-${curr.periodIndex}`]) {
              acc[`${curr.year}-${curr.periodIndex}`] = {
                year: curr.year,
                periodIndex: curr.periodIndex,
                childrens: [],
              };
            }
            acc[`${curr.year}-${curr.periodIndex}`].childrens.push({
              name: curr.mediumClass,
              largeClass: curr.largeClass,
              totalPoint: curr.totalPoint || 0,
              year: curr.year,
              periodIndex: curr.periodIndex,
            });

            return acc;
          }, {});
          mergeYearPeriodMediumClassfications[`${state.jobType.indexOf(v)}`] = [
            Object.values(large),
            Object.values(medium),
          ];

          const foundNumber = mode.number;
          const sourceData =
            mode.modeLarge === 1
              ? Object.values(mergeYearPeriodMediumClassfications[`${state.jobType.indexOf(v)}`][0])
              : Object.values(mergeYearPeriodMediumClassfications[`${state.jobType.indexOf(v)}`][1]);

          const pageSize = Math.ceil(
            foundNumber !== undefined && foundNumber !== -1 ? Math.floor(foundNumber) : sourceData.length,
          );
          for (let j = 0; j < sourceData.length; j += pageSize) {
            currentJobTypeResults.push(sourceData.slice(j, j + pageSize));
          }
        }
        count += currentJobTypeResults.length; // Cộng số lượng biểu đồ Radar/Bar
      });
    }

    return count;
  }, [state.jobType, state.numberGroupPageChart]);

  useEffect(() => {
    if (!location) return navigate(`/company/${params.companyCode}/evaluator/development-professional-expertise`, {});
    const callBack = (data: professionalExpertise[]) => {
      if (data && data.length > 0) {
        dispatch({ type: 'SET_JOB_TYPE', payload: data });
        setListJobTypes(data.map((v) => v.jobType));
      }
    };
    const errorCallBack = (bool: boolean) => {
      setIsLoading(bool);
    };
    evaluatorApiService.detailProfessionalExpertise(
      location.userId,
      location.yearStart,
      location.yearEnd,
      callBack,
      errorCallBack,
    );
  }, []);

  // Option nhóm kì hiển thị
  const optionsSelectGroups = [
    {
      label: t('REVIEW_SUMMARY.OPTIONS.ITEM_1'),
      value: 1,
    },
    {
      label: t('REVIEW_SUMMARY.OPTIONS.ITEM_2'),
      value: 2,
    },
    {
      label: t('REVIEW_SUMMARY.OPTIONS.ITEM_3'),
      value: 3,
    },
    {
      label: t('REVIEW_SUMMARY.OPTIONS.ITEM_5'),
      value: 5,
    },
    {
      label: t('REVIEW_SUMMARY.OPTIONS.ITEM_10'),
      value: 10,
    },
    {
      label: t('IDS_ALL'),
      value: -1,
    },
  ];

  // Biển đổi hiển thị kỳ đánh giá vào biểu đồ
  // Ex: Nhóm 2 kỳ sẽ hiển thị 2 kỳ vào 1 biểu đồ.
  const transformChartMediumClass = (
    value: number,
    _option: { label: string; value: number } | { label: string; value: number }[],
    index: number | undefined,
  ) => {
    const newStates: {
      number: number;
      index: number;
      modeLarge: number;
    }[] = state.numberGroupPageChart.map((item) => {
      if (item.index === index) {
        return {
          ...item,
          number: value,
          index: item.index,
        };
      }

      return item;
    });

    if (state.numberGroupPageChart.filter((v) => v.index === index).length === 0) {
      newStates.push({
        modeLarge: 1,
        number: value,
        index: index || 0,
      });
    }

    dispatch({
      type: 'SET_NUMBER_GROUP_PAGE_CHART',
      payload: newStates,
    });
  };

  // Mặc định sẽ hiển thị tất cả
  const handleDisplayMediumClass = (mediumClass: any[], options: any, index: number) => {
    const mode = state.numberGroupPageChart.find((v) => v.index === index);
    if (mediumClass.length === 1 && mediumClass[0].length === 1 && mediumClass[0][0] === t('IDS_ALL')) {
      const newObject: any = {};
      if (mode?.modeLarge === 1 || !mode) {
        newObject[index] = Object.values(state.groupMediumClasses[index].map((v: any) => v.largeClass));
        const newGroupDelete = { ...state.listGroupDelete, ...newObject };
        dispatch({
          type: 'SET_LIST_DELETE_CLASSFICATION',
          payload: newGroupDelete,
        });
      } else {
        const checkedChildren = options[0][0].children.map((val: any) => {
          return val.children.map((v: any) => v.mediumClass);
        });

        newObject[index] = Object.values(checkedChildren).flat();
        const newGroupDelete = { ...state.listGroupDelete, ...newObject };
        dispatch({
          type: 'SET_LIST_DELETE_CLASSFICATION',
          payload: newGroupDelete,
        });
      }
    } else {
      const newObject: any = {};
      if (mediumClass.length === 0 && mode?.modeLarge === 1) {
        newObject[index] = Object.values(state.groupMediumClasses[index].map((v: any) => v.largeClass));
        const newGroupDelete = { ...state.listGroupDelete, ...newObject };
        dispatch({
          type: 'SET_LIST_DELETE_CLASSFICATION',
          payload: newGroupDelete,
        });
      } else if (mediumClass.length === 0 && mode?.modeLarge === 2) {
        if (options[0]) {
          const checkedChildren = options[0][0].children.map((val: any) => {
            return val.children.map((v: any) => v.mediumClass);
          });

          newObject[index] = Object.values(checkedChildren).flat();
          const newGroupDelete = { ...state.listGroupDelete, ...newObject };
          dispatch({
            type: 'SET_LIST_DELETE_CLASSFICATION',
            payload: newGroupDelete,
          });
        }
      }

      if ((mediumClass.length > 0 && mode?.modeLarge === 1) || !mode) {
        const newObject: any = {};
        newObject[index] = Object.values(mediumClass.flat());
        const newGroupDelete = { ...state.listGroupDelete, ...newObject };
        dispatch({
          type: 'SET_LIST_DELETE_CLASSFICATION',
          payload: newGroupDelete,
        });
      } else {
        const newObject: any = {};
        const checkedChildren = options.map((v: any) => {
          if (v[v.length - 1].children) {
            const checkedItems = v[v.length - 1];

            return checkedItems.children.map((val: any) => val.mediumClass).flat();
          } else {
            return v[v.length - 1].mediumClass;
          }
        });
        newObject[index] = Object.values(checkedChildren).flat();
        const newGroupDelete = { ...state.listGroupDelete, ...newObject };
        dispatch({
          type: 'SET_LIST_DELETE_CLASSFICATION',
          payload: newGroupDelete,
        });
      }
    }
  };

  // Chế độ hiển thị (Hiển thị theo phân loại lớn, hiển thị theo phân loại trung bình)
  const transformModeDisplay = (mode: number, index: number) => {
    const newStates: {
      number: number;
      index: number;
      modeLarge: number;
    }[] = state.numberGroupPageChart.map((item) => {
      if (item.index === index) {
        return {
          ...item,
          modeLarge: mode,
          index: item.index,
        };
      }

      return item;
    });

    if (state.numberGroupPageChart.filter((v) => v.index === index).length === 0) {
      newStates.push({
        number: 1,
        index: index || 0,
        modeLarge: mode,
      });
    }
    dispatch({
      type: 'SET_NUMBER_GROUP_PAGE_CHART',
      payload: newStates,
    });
    if (state.numberGroupPageChart[index] && mode !== state.numberGroupPageChart[index].modeLarge) {
      dispatch({
        type: 'SET_LIST_DELETE_CLASSFICATION',
        payload: [],
      });
    } else {
      dispatch({
        type: 'SET_LIST_DELETE_CLASSFICATION',
        payload: [],
      });
    }
    if (mode === 1 && state.stateGroupMediumClass) {
      state.stateGroupMediumClass.map((v, i) => {
        const defaultAlls: any[] = [];
        v.forEach((val: any) => {
          defaultAlls.push([val.label]);
        });
        if (v.length > 0) {
          form.setFieldsValue({
            [`mediumClass${i}`]: [t('IDS_ALL')],
          });
        } else {
          form.setFieldsValue({
            [`mediumClass${i}`]: [],
          });
        }
      });
    }
  };
  useEffect(() => {
    const mediumClassList: any[] = [];
    const largeClassList: any[] = [];
    const mediumGroups: any[] = [];
    if (state.jobType && state.jobType.length > 0) {
      state.jobType.map((v, _i) => {
        if (!v.childrens || v.childrens.length === 0) return null; // Tránh lỗi nếu childrens không có dữ liệu
        const sliceMediumClass = [...v.childrens.map((v: any) => v.childs)]
          .flat()
          .filter((value, index, self) => index === self.findIndex((v) => v.mediumClass === value.mediumClass))
          .map((val) => {
            const mediumClassSlice = val.mediumClass.split('_');

            return {
              largeClass: mediumClassSlice[0],
              mediumClass: mediumClassSlice.slice(1).join('_').replace(/\n/g, '') || mediumClassSlice[0],
              smallClass: val.smallClass,
              difficulty: val.difficulty,
              pointEvaluator2: val.pointEvaluator2,
              periodIndex: val.periodIndex,
              year: val.year,
            };
          });
        const mergeLargeClass = sliceMediumClass.reduce(
          (acc: Record<string, { label: string; value: string; children: any[] }>, curr) => {
            if (!acc[curr.largeClass]) {
              acc[curr.largeClass] = {
                label: curr.largeClass,
                value: curr.largeClass,
                children: [],
              };
            }
            acc[curr.largeClass].children.push({
              largeClass: curr.largeClass,
              smallClass: curr.smallClass,
              mediumClass: curr.mediumClass,
              difficulty: curr.difficulty,
              pointEvaluator2: curr.pointEvaluator2,
              periodIndex: curr.periodIndex,
              year: curr.year,
              label: curr.mediumClass,
              value: curr.mediumClass,
            });

            return acc;
          },
          {},
        );

        //
        const mediumClass = v.childrenMedium
          .flat()
          .filter((value, index, self) => index === self.findIndex((v) => v.mediumClass === value.mediumClass));

        const largeClass = v.childrenLarge
          .flat()
          .filter((value, index, self) => index === self.findIndex((v) => v.largeClass === value.largeClass));

        largeClassList.push(largeClass);
        mediumClassList.push(mediumClass);
        mediumGroups.push(Object.values(mergeLargeClass));
      });
      dispatch({ type: 'SET_MEDIUM_CLASS_DEFAULT', payload: mediumClassList });
      dispatch({ type: 'SET_LARGE_CLASS_DEFAULT', payload: largeClassList });
      dispatch({
        type: 'SET_GROUP_MEDIUM_CLASS',
        payload: mediumGroups,
      });
      setStateGroup(mediumGroups);

      mediumGroups.map((v, i) => {
        const defaultAlls: any[] = [];
        v.forEach((val: any) => {
          defaultAlls.push([val.label]);
        });
        if (v.length > 0) {
          form.setFieldsValue({
            [`mediumClass${i}`]: [t('IDS_ALL')],
            [`tabMediumClass${i}`]: 1,
            [`group${i}`]: 1,
          });
        } else {
          form.setFieldsValue({
            [`mediumClass${i}`]: [],
            [`tabMediumClass${i}`]: 1,
            [`group${i}`]: 1,
          });
        }
      });
    }
  }, [state.jobType]);

  // Scroll to view
  // Bấm vào job type theo mục lục sẽ di chuyển đến block job đấy.
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Bấm vào để hiển thị block theo job type
  const visibilityJobType = (jobType: string, hidden: boolean) => {
    if (hidden) {
      setListJobTypes(listJobTypes.filter((v) => v !== jobType));
    } else {
      setListJobTypes((state) => [...state, jobType]);
    }
  };

  // Scroll to top
  const scrollToTopPage = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };
  const reactToPrintContent = useCallback(() => {
    return componentRef.current;
  }, [componentRef]);

  const [text, setText] = useState('LOADING');

  const onBeforeGetContentResolve = useRef(null) as any;

  useEffect(() => {
    if (
      isOutputPDF &&
      renderedChartCount > 0 &&
      renderedChartCount === totalExpectedCharts &&
      typeof onBeforeGetContentResolve.current === 'function'
    ) {
      onBeforeGetContentResolve.current();
      setText('LOADED');
      setRenderedChartCount(0); // Reset counter after print completes
    }
  }, [renderedChartCount, totalExpectedCharts, isOutputPDF]);

  const [isLoadingOutput, setLoadingOutput] = useState(false);

  const handleOnBeforeGetContent = useCallback(async () => {
    setRenderedChartCount(0);
    setOutputPDF(true);

    // eslint-disable-next-line no-async-promise-executor
    return await new Promise<void>(async (resolve) => {
      onBeforeGetContentResolve.current = resolve;

      setTimeout(() => {
        setText('LOADED');
        resolve();
        setOutputPDF(false);
        setLoadingOutput(false);
      }, 4000);
    });
  }, [setText]);

  useEffect(() => {
    if (isLoadingOutput) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden'; // Cũng có thể áp dụng cho html
    } else {
      document.body.style.overflow = ''; // Trả về mặc định
      document.documentElement.style.overflow = ''; // Trả về mặc định
    }
  }, [isLoadingOutput]); // Dependency là islodd

  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
    documentTitle: `${t('IDS_DEVELOP_PRO_SKILL_EXPERTISE_DETAIL')}_${location?.userName}.pdf`,
    onBeforeGetContent: handleOnBeforeGetContent,
    removeAfterPrint: false,
  });

  const MyRadarChart = (props: { datas: dataSets[]; categories: string[]; keyValues: string, periodNumber: number, countChart: number }) => {
    const adjustedDatas: any = [...props.datas];

    // Kiểm tra nếu số lượng datasets hiện tại không đủ periodNumber
    if (adjustedDatas.length < props.periodNumber && props.countChart > 1) {
      const missingCount = props.periodNumber - adjustedDatas.length;
      for (let i = 0; i < (missingCount * 2); i++) {
        adjustedDatas.push({
          backgroundColor: 'transparent',
          label: '',
          color: 'transparent',
          pointBackgroundColor: 'transparent',
          hidden: true,
          borderColor: 'transparent',
          borderWidth: 0,
          pointBorderColor: 'transparent',
          pointHoverBorderColor: 'transparent',
        });
      }
    }

    const data = {
      labels: transformCategories(props.categories),
      datasets: adjustedDatas,
    };

    const options: ChartOptions<'radar'> = {
      maintainAspectRatio: false,
      responsive: true,
      devicePixelRatio: 2,
      onHover: (event: ChartEvent, chartElements: ActiveElement[]) => {
        const canvas = event.native?.target as HTMLCanvasElement; // Type assertion
        if (chartElements.length) {
          // Change cursor to pointer when hovering over markers
          canvas.style.cursor = 'pointer';
        } else {
          // Reset cursor when not hovering over markers
          canvas.style.cursor = 'default';
        }
      },
      scales: {
        r: {
          beginAtZero: true,
          ticks: {
            stepSize: 5, // Khoảng giá trị giữa mỗi lưới
            font: {
              size: 12,
            },
            backdropColor: 'rgba(255,255,255,0.05)',
          },
          suggestedMin: 0,
          suggestedMax: 25,
          grid: {
            color: 'rgba(0, 0, 0, 0.4)', // Màu lưới
          },
          pointLabels: {
            font: {
              size: 10,
              weight: 600,
            },
          },
        },
      },
      elements: {
        line: {
          borderWidth: 3,
        },
      },
      layout: {
        autoPadding: true,
      },
      animation: {
        duration: 1000,
      },
      plugins: {
        legend: {
          position: 'bottom' as const,
          onClick: function (e: any, legendItem: any, legend: any) {
            const index = legendItem.datasetIndex;
            const ci = legend.chart;

            // Toggle visibility
            ci.data.datasets[index].hidden = !ci.data.datasets[index].hidden;
            ci.update();
          },
        },
        title: {
          display: true,
          text:
            props.datas.length > 1
              ? `${props.datas[0].label} - ${props.datas[props.datas.length - 1].label}`
              : props.datas[0].label,
          font: {
            size: 10,
          },
        },
        tooltip: {
          enabled: false, // Disable default tooltips
          callbacks: {
            title(_tooltipItems) {
              return '';
            },
            label(tooltipItem) {
              return `${tooltipItem.dataset.label} - ${tooltipItem.label?.toString().replaceAll(',', '')}: ${
                tooltipItem.raw
              }`;
            },
          },

          external: function (context) {
            // Tạo tooltip tùy chỉnh

            const tooltipEl = document.getElementById(`chartjs-tooltip-${props.keyValues}`);

            if (!tooltipEl) {
              const newTooltipEl = document.createElement('div');
              newTooltipEl.id = 'chartjs-tooltip';
              newTooltipEl.style.position = 'absolute';
              newTooltipEl.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
              newTooltipEl.style.color = 'white';
              newTooltipEl.style.borderRadius = '3px';
              newTooltipEl.style.padding = '10px 5px';
              newTooltipEl.style.width = 'auto';
              newTooltipEl.style.fontSize = '10px';
              newTooltipEl.style.zIndex = '1000'; // Z-index cao
              newTooltipEl.style.pointerEvents = 'none'; // Đảm bảo tooltip không cản trở tương tác chuột với biểu đồ
              newTooltipEl.style.whiteSpace = 'nowrap'; // NGĂN CHẶN XUỐNG HÀNG
              document.body.appendChild(newTooltipEl);
            }

            if (context.tooltip.opacity === 0) {
              if (tooltipEl) {
                tooltipEl.style.display = 'none';
              }

              return;
            }
            if (tooltipEl) {
              tooltipEl.style.borderRadius = '3px';
              tooltipEl.style.padding = '0 5px 0 5px';
              tooltipEl.style.zIndex = '1000'; // Z-index cao
              tooltipEl.style.display = 'block';
              tooltipEl.style.color = 'white';
              tooltipEl.style.width = 'auto';
              tooltipEl.style.fontSize = '10px';
              tooltipEl.style.textAlign = 'left';
              tooltipEl.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
              tooltipEl.style.whiteSpace = 'nowrap'; // Đảm bảo không xuống hàng
              tooltipEl.style.left = context.tooltip.caretX + 7 + 'px';
              tooltipEl.style.top = context.tooltip.caretY - 20 + 'px';
              tooltipEl.innerHTML = context.tooltip.body.map((item) => item.lines).join('<br/>');
            }
          },

          position: 'average',
        },
      },
    };

    return (
      <>
        <div
          id={`chartjs-tooltip-${props.keyValues}`}
          style={{ display: 'none', position: 'absolute', zIndex: 1000 }}
        ></div>
        <div style={{ width: '100%', height: '500px' }}>
          <Radar
            key={props.keyValues}
            data={data}
            options={{
              ...options,
            }}
            plugins={[
              {
                id: 'dataLabel' + props.keyValues,
                afterDraw: (chart) => {
                  const ctx = chart.ctx;
                  chart.data.datasets.forEach((dataset, datasetIndex) => {
                    if (!dataset.hidden) {
                      const meta = chart.getDatasetMeta(datasetIndex);
                      meta.data.forEach((point, index) => {
                        const value: any = dataset.data[index];
                        const position = point.tooltipPosition(true);

                        // Vẽ nền cho text label
                        const textWidth = ctx.measureText(String(value)).width;
                        const textHeight = 14; // Kích thước chữ
                        const padding = 5; // Khoảng cách giữa chữ và nền

                        // Tính toán vị trí căn giữa
                        const backdropX = position.x - textWidth / 2 - padding;
                        const backdropY = position.y - textHeight / 2; // Điều chỉnh vị trí

                        // Vẽ hình chữ nhật
                        let bgColor = dataset.borderColor;
                        if (Array.isArray(bgColor)) {
                          bgColor = bgColor.find((c) => typeof c === 'string') || '#fff';
                        } else if (typeof bgColor === 'function') {
                          bgColor = '#fff';
                        }
                        ctx.fillStyle = typeof bgColor === 'string' ? bgColor : '#fff'; // Màu nền
                        ctx.fillRect(backdropX, backdropY, textWidth + padding * 2, textHeight);

                        // Vẽ text label căn giữa
                        ctx.fillStyle = 'black';
                        ctx.textAlign = 'center'; // Căn giữa văn bản

                        ctx.fillText(value, position.x, position.y); // Văn bản căn giữa
                      });
                    }
                  });
                  //
                },
              },
            ]}
          />
        </div>
      </>
    );
  };

  // Bar
  const MyBarChart = (props: { datas: dataSets[]; categories: string[]; keyValues: string; periodNumber: number, countChart: number }) => {
    const adjustedDatas: any = [...props.datas];

    // Kiểm tra nếu số lượng datasets hiện tại không đủ periodNumber
    if (adjustedDatas.length < props.periodNumber && props.countChart > 1) {
      const missingCount = props.periodNumber - adjustedDatas.length;
      for (let i = 0; i < (missingCount * 2); i++) {
        adjustedDatas.push({
          backgroundColor: 'transparent',
          label: '',
          color: 'transparent',
          pointBackgroundColor: 'transparent',
          hidden: true,
        });
      }
    }

    const data = {
      labels: props.categories,
      datasets: adjustedDatas,
    };
    const options: ChartOptions<'bar'> = {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 5, // Khoảng giá trị giữa mỗi lưới
          },
          suggestedMin: 0,
          suggestedMax: 25,
        },
      },
      plugins: {
        legend: {
          position: 'bottom' as const,
          onClick: function (e: any, legendItem: any, legend: any) {
            const index = legendItem.datasetIndex;
            const ci = legend.chart;

            // Toggle visibility
            ci.data.datasets[index].hidden = !ci.data.datasets[index].hidden;
            ci.update();
          },
        },
        title: {
          display: true,
          text:
            props.datas.length > 1
              ? `${props.datas[0].label} - ${props.datas[props.datas.length - 1].label}`
              : props.datas[0].label,
        },
        tooltip: {
          enabled: false, // Disable default tooltips
        },
      },
    };

    return (
      <div style={{ position: 'relative', height: '300px' }}>
        <Bar
          key={props.keyValues}
          data={data}
          options={{
            ...options,
          }}
          plugins={[
            {
              id: 'dataLabel' + props.keyValues,
              afterDraw: (chart) => {
                const ctx = chart.ctx;

                chart.data.datasets.forEach((dataset, datasetIndex) => {
                  if (!dataset.hidden) {
                    const meta = chart.getDatasetMeta(datasetIndex);
                    meta.data.forEach((point: any, index) => {
                      const value: any = dataset.data[index];
                      const position = point.tooltipPosition(true);

                      // Vẽ text label căn giữa
                      ctx.fillStyle = 'black';
                      ctx.font = 'bold 12px Arial';
                      ctx.textAlign = 'center'; // Căn giữa văn bản
                      const y = position.y + Number(point.height) / 2;
                      ctx.fillText(value, position.x, Number(value) > 0 ? y : position.y - 10); // Văn bản căn giữa (offset fixed)
                    });
                  }
                });
              },
            },
          ]}
        />
      </div>
    );
  };

  return (
    <>
      <div
        className={styles.padding}
        style={{
          pageBreakAfter: 'always',
        }}
      >
        <Typography.Title level={3}>{t('IDS_DEVELOP_PRO_SKILL_EXPERTISE_DETAIL')}</Typography.Title>
        <Card className="IsExportPDF">
          <Typography.Title level={3}>{t('REVIEW_SUMMARY.IDS_TITLE_INFOR_USER_OF_SUMMARY')}</Typography.Title>
          {/* Thông tin cơ bản của nhân viên */}
          <InfomationEmployee
            period={`${location && location.yearStart} ~ ${location && location.yearEnd}`}
            departmentName={location && location.departmentName?.replace('\n', t('IDS_COMMA'))}
            divisionName={location && location.divisionName?.replaceAll('IDS_COMMA', t('IDS_COMMA'))}
            employeeNumber={location && location.employeeNumber}
            fullName={location && location.userName}
            level={location && location.level}
            t={t}
          />
        </Card>
        {!isLoading ? (
          <>
            <Space className={styles.hidden_print_block} hidden={state.jobType.length === 0}>
              <Button
                type="primary"
                onClick={() => {
                  setLoadingOutput(true);

                  setTimeout(() => {
                    handlePrint();
                  }, 1000);
                }}
                loading={isLoading}
                hidden={state.jobType.length === 0}
              >
                {t('REVIEW_SUMMARY.IDS_EXPORT_PDF_PRO_SKILL')}
              </Button>
              <MainButton
                type="primary"
                name="Search"
                value="txt_evaluation_search"
                style={{ marginBottom: '20px', marginTop: 20 }}
                onClick={handleOpenPDFDetail}
                loading={isLoading}
                hidden={state.jobType.length === 0}
              >
                {t('IDS_PDF_DETAIL_EVALUATION_EXPERTISE')}
              </MainButton>
            </Space>
            {state.jobType && state.jobType.length > 0 ? (
              <Card className={styles.margin_30_block_when_print}>
                {/* Mục lục */}
                <Typography.Title level={4} style={{}}>
                  {t('REVIEW_SUMMARY.IDS_JOB_TYPE_LIST')}
                </Typography.Title>
                {state.jobType.map((item, index) => (
                  <div key={`${item.jobType}-${index}`}>
                    <Typography.Title
                      level={5}
                      style={{ marginBottom: '10px', cursor: 'pointer', color: '#000', display: 'inline-block' }}
                      onClick={() => scrollToSection(item.jobType)}
                      className={` ${styles.hidden_print_block}`}
                    >
                      {`${index + 1}. ${item.jobType}`}
                    </Typography.Title>
                  </div>
                ))}
                {/* Hiển thị từng Job */}

                {state.jobType &&
                  state.jobType.map((v, i) => {
                    // Lọc ra các mediumclass duy nhất từ childrens
                    if (!v.childrens || v.childrens.length === 0) return null; // Tránh lỗi nếu childrens không có dữ liệu
                    // ============= Xử lý phân loại trung bình =================
                    // const mergeYearPeriodMediumClassfications = {};
                    const mergeYearPeriodMediumClassfications: any = {};
                    const large = v.childrenLarge.reduce((acc: Record<string, any>, curr: any) => {
                      if (!acc[`${curr.year}-${curr.periodIndex}`]) {
                        acc[`${curr.year}-${curr.periodIndex}`] = {
                          year: curr.year,
                          periodIndex: curr.periodIndex,
                          childrens: [],
                        };
                      }
                      acc[`${curr.year}-${curr.periodIndex}`].childrens.push({
                        name: curr.largeClass,
                        totalPoint: curr.totalPoint || 0,
                        year: curr.year,
                        periodIndex: curr.periodIndex,
                      });

                      return acc;
                    }, [] as Record<string, any>);
                    const isGroupDeletes: any = state.listGroupDelete[i] ? state.listGroupDelete[i] : [];
                    const filterLarges = Object.values(large).map((v) => {
                      if (state.listGroupDelete[i] && isGroupDeletes.length > 0) {
                        return {
                          ...v,
                          childrens: v.childrens.filter((v: any) => isGroupDeletes.includes(v.name)),
                        };
                      }

                      return v;
                    });

                    const medium = v.childrenMedium.reduce((acc: Record<string, any>, curr: any) => {
                      if (!acc[`${curr.year}-${curr.periodIndex}`]) {
                        acc[`${curr.year}-${curr.periodIndex}`] = {
                          year: curr.year,
                          periodIndex: curr.periodIndex,
                          childrens: [],
                        };
                      }

                      acc[`${curr.year}-${curr.periodIndex}`].childrens.push({
                        name: curr.mediumClass,
                        largeClass: curr.largeClass,
                        totalPoint: curr.totalPoint || 0,
                        year: curr.year,
                        periodIndex: curr.periodIndex,
                      });

                      return acc;
                    }, [] as Record<string, any>);
                    const filterMediums = Object.values(medium).map((v) => {
                      if (state.listGroupDelete[i] && isGroupDeletes.length > 0) {
                        if (state.listGroupDelete[i] && isGroupDeletes.length > 0) {
                          return {
                            ...v,
                            childrens: v.childrens.filter((v: any) => isGroupDeletes.includes(v.name)),
                          };
                        }
                      }

                      return v;
                    });
                    mergeYearPeriodMediumClassfications[`${i}`] = [
                      Object.values(filterLarges),
                      Object.values(filterMediums),
                    ];

                    // cắt nhỏ năm ra
                    // Không có page size và không có chia mục hiển thị (mode)
                    const results: any[] = [];
                    const mode: any = state.numberGroupPageChart.find((v) => v.index === i);
                    if (state.numberGroupPageChart.length === 0) {
                      const pageSize = Math.ceil(Math.floor(1));
                      for (
                        let j = 0;
                        j < Object.keys(mergeYearPeriodMediumClassfications[i][0]).length;
                        j += pageSize
                      ) {
                        results.push(Object.values(mergeYearPeriodMediumClassfications[i][0]).slice(j, j + pageSize));
                      }
                    } else {
                      // Kiểm tra trong state có index này không
                      if (state.numberGroupPageChart.find((v) => v.index === i)) {
                        // Nếu có thì sẽ lấy number này làm page size
                        const foundNumber = state.numberGroupPageChart.find((v) => v.index === i)?.number;

                        if (mode.modeLarge === 1) {
                          const pageSize = Math.ceil(
                            foundNumber !== undefined && foundNumber !== -1
                              ? Math.floor(foundNumber)
                              : Object.values(mergeYearPeriodMediumClassfications[i][0]).length,
                          );
                          for (
                            let j = 0;
                            j < Object.keys(mergeYearPeriodMediumClassfications[i][0]).length;
                            j += pageSize
                          ) {
                            results.push(
                              Object.values(mergeYearPeriodMediumClassfications[i][0]).slice(j, j + pageSize),
                            );
                          }
                        } else {
                          const pageSize = Math.ceil(
                            foundNumber !== undefined && foundNumber !== -1
                              ? Math.floor(foundNumber)
                              : Object.values(mergeYearPeriodMediumClassfications[i][1]).length,
                          );
                          for (
                            let j = 0;
                            j < Object.keys(mergeYearPeriodMediumClassfications[i][1]).length;
                            j += pageSize
                          ) {
                            results.push(
                              Object.values(mergeYearPeriodMediumClassfications[i][1]).slice(j, j + pageSize),
                            );
                          }
                        }
                      } else {
                        // Không tìm thấy index sẽ lấy page number = 1
                        const pageSize = Math.ceil(Math.floor(1));
                        for (
                          let j = 0;
                          j < Object.keys(mergeYearPeriodMediumClassfications[i][0]).length;
                          j += pageSize
                        ) {
                          results.push(Object.values(mergeYearPeriodMediumClassfications[i][0]).slice(j, j + pageSize));
                        }
                      }
                    }

                    // [{year: 2024, periodIndex: 1, children: [
                    // {mediumClass: abc, difficulty: 1, pointEvaluator2: 2},
                    // {mediumClass: abc, difficulty: 2, pointEvaluator2: 3},
                    // {mediumClass: システム, difficulty: 3, pointEvaluator2: 4},
                    // {mediumClass: システム, difficulty: 5, pointEvaluator2: 5},
                    // ]},
                    // {year: 2024, periodIndex: 2, children: [
                    // {mediumClass: abc, difficulty: 1, pointEvaluator2: 2},
                    // {mediumClass: 2222, difficulty: 2, pointEvaluator2: 3},
                    // ]}] => [{year: `${year}${periodIndex}`, data: [5,2,3]}, {year: `${year}${periodIndex}`, data: [1,2,3]}] bên trong data là những điểm được tính từ difficulty * pointEvaluator2 có cùng
                    // mediumClass sẽ cộng lại và chia trung bình cộng

                    const colors = [
                      'rgba(75, 192, 192, 0.2)', // Xanh Ngọc Nhạt
                      'rgba(255, 99, 132, 0.2)', // Đỏ Nhạt
                      'rgba(255, 206, 86, 0.2)', // Vàng Nhạt
                      'rgba(54, 162, 235, 0.2)', // Xanh Dương Nhạt
                      'rgba(0, 128, 0, 0.2)', // Xanh Lá Cây Nhạt
                      'rgba(153, 102, 255, 0.2)', // Tím Nhạt
                      'rgba(255, 159, 64, 0.2)', // Cam Nhạt
                      'rgba(192, 192, 192, 0.2)', // Xám Nhạt
                      'rgba(255, 182, 193, 0.2)', // Hồng Nhạt
                      'rgba(255, 165, 0, 0.2)',
                    ];
                    const borderColors = [
                      'rgba(75, 192, 192, 0.5)', // Xanh Ngọc Nhạt
                      'rgba(255, 99, 132, 0.5)', // Đỏ Nhạt
                      'rgba(255, 206, 86, 0.5)', // Vàng Nhạt
                      'rgba(54, 162, 235, 0.5)', // Xanh Dương Nhạt
                      'rgba(0, 128, 0, 0.5)', // Xanh Lá Cây Nhạt
                      'rgba(153, 102, 255, 0.5)', // Tím Nhạt
                      'rgba(255, 159, 64, 0.5)', // Cam Nhạt
                      'rgba(192, 192, 192, 0.5)', // Xám Nhạt
                      'rgba(255, 182, 193, 0.5)', // Hồng Nhạt
                      'rgba(255, 165, 0, 0.5)',
                    ];

                    // Hiển thị values combobox
                    let listLarges: any[] = [];
                    if (state.numberGroupPageChart.length === 0) {
                      stateGroups[i] &&
                        stateGroups[i].forEach((v: any) => {
                          listLarges.push({
                            ...v,
                          });
                        });
                      listLarges.map((v) => {
                        delete v.children;

                        return v;
                      });
                    } else {
                      if (mode) {
                        if (mode?.modeLarge === 1) {
                          stateGroups[i] &&
                            stateGroups[i].forEach((v: any) => {
                              listLarges.push({
                                ...v,
                              });
                            });
                          listLarges.map((v) => {
                            delete v.children;

                            return v;
                          });
                        } else {
                          listLarges = stateGroups[i];
                        }
                      } else {
                        stateGroups[i] &&
                          stateGroups[i].forEach((v: any) => {
                            listLarges.push({
                              ...v,
                            });
                          });
                        listLarges.map((v) => {
                          delete v.children;

                          return v;
                        });
                      }
                    }

                    return (
                      <>
                        <div
                          style={{
                            padding: '0 !important',
                            border: '1px solid #025832',
                            width: '100%',
                            margin: '10px 0',
                            pageBreakBefore: 'always',
                          }}
                          key={`${v.jobType}-${i}-${Math.floor(Math.random()).toString()}`}
                          id={`${v.jobType}`}
                        >
                          <div
                            className={'your-background-class'}
                            style={{ background: '#025832', marginBottom: '10px' }}
                          >
                            <Typography.Title
                              level={5}
                              style={{ marginBottom: '10px', fontWeight: 'normal', padding: '5px 10px', color: '#fff' }}
                            >
                              <MinusCircleOutlined
                                style={{ cursor: 'pointer', color: '#fff', marginRight: 10 }}
                                color="#fff"
                                onClick={() => {
                                  visibilityJobType(v.jobType, true);
                                }}
                                hidden={!listJobTypes.includes(v.jobType)}
                                className={styles.hidden_print_block}
                              />
                              <PlusCircleOutlined
                                style={{ cursor: 'pointer', color: '#fff', marginRight: 10 }}
                                color="#fff"
                                onClick={() => {
                                  visibilityJobType(v.jobType, false);
                                }}
                                hidden={listJobTypes.includes(v.jobType)}
                                className={styles.hidden_print_block}
                              />
                              <b> {`${i + 1}. ${v.jobType}`}</b>
                            </Typography.Title>
                          </div>
                          <div style={{ display: listJobTypes.includes(v.jobType) ? 'block' : 'none' }}>
                            <div id="chart">
                              <Typography.Title
                                level={4}
                                style={{ marginBottom: '10px', fontWeight: 'bold', padding: '5px 10px' }}
                              >
                                {t('REVIEW_SUMMARY.IDS_TITLE_JOB_TYPE')}
                              </Typography.Title>
                              <Row>
                                <Col
                                  xl={v.childrens?.length > 6 ? 14 : v.childrens?.length >= 9 ? 16 : 12}
                                  lg={v.childrens?.length > 6 ? 18 : v.childrens?.length >= 9 ? 20 : 16}
                                  md={24}
                                  sm={24}
                                >
                                  <div style={{ position: 'relative', height: '300px' }}>
                                    <Bar
                                      data={{
                                        labels: v.childrens.map((child) => {
                                          return `${child.year}${
                                            child.periodIndex === 1
                                              ? t('IDS_FIRST_PERIOD_WITH_YEAR')
                                              : t('IDS_SECOND_PERIOD_WITH_YEAR')
                                          }`;
                                        }),
                                        datasets: [
                                          {
                                            data: v.childrens.map((child) => {
                                              return child.totalPoint;
                                            }),
                                            backgroundColor: 'rgba(99, 154, 255, 0.6)',
                                            borderColor: 'rgba(99, 154, 255, 0.6)',
                                            borderWidth: 1, // Tắt đường viền
                                            barThickness: 30, // Chiều rộng của cột
                                          },
                                        ],
                                      }}
                                      options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        animation: false,
                                        scales: {
                                          y: {
                                            min: 0,
                                            max: 25,
                                          },
                                        },
                                        plugins: {
                                          legend: {
                                            display: false,
                                          },
                                          tooltip: {
                                            enabled: false,
                                          },
                                        },
                                      }}
                                      plugins={[
                                        {
                                          id: 'dataLabel',
                                          afterDraw: (chart) => {
                                            const ctx = chart.ctx;

                                            chart.data.datasets.forEach((dataset, datasetIndex) => {
                                              if (!dataset.hidden) {
                                                const meta = chart.getDatasetMeta(datasetIndex);
                                                meta.data.forEach((point: any, index) => {
                                                  const value: any = dataset.data[index];
                                                  const position = point.tooltipPosition(true);

                                                  // Vẽ text label căn giữa
                                                  ctx.fillStyle = 'black';
                                                  ctx.textAlign = 'center'; // Căn giữa văn bản
                                                  ctx.fillText(
                                                    value,
                                                    position.x,
                                                    position.y + Number(point.height) / 2,
                                                  ); // Văn bản căn giữa (offset fixed)
                                                });
                                              }
                                            });
                                          },
                                        },
                                      ]}
                                    />
                                  </div>
                                </Col>
                              </Row>
                            </div>
                            <Typography.Title
                              level={4}
                              style={{ marginBottom: '10px', fontWeight: 'bold', padding: '5px 10px' }}
                            >
                              {t('REVIEW_SUMMARY.IDS_MEDIUM_CLASS_LIST')}
                            </Typography.Title>
                            <div id="html-dist" style={{ padding: '10px' }} className={styles.hidden_print_block}>
                              <Form
                                labelCol={{ span: 3 }}
                                labelAlign="left"
                                layout="horizontal"
                                colon={false}
                                form={form}
                              >
                                <Form.Item name={`tabMediumClass${i}`} label={t('IDS_SELECT_CATEGORY')}>
                                  <Radio.Group
                                    onChange={(e) => {
                                      transformModeDisplay(e.target.value, i);
                                    }}
                                    options={[
                                      { value: 1, label: t('IDS_LARGE_CATEGORY') },
                                      { value: 2, label: t('IDS_MEDIUM_CATEGORY') },
                                    ]}
                                  />
                                </Form.Item>
                                <Form.Item name={`mediumClass${i}`} label={t('IDS_LARGE_MEDIUM_CATEGORY')}>
                                  <Cascader
                                    key={i}
                                    multiple
                                    options={[{ label: t('IDS_ALL'), value: t('IDS_ALL'), children: listLarges }]}
                                    onChange={(value, option) => {
                                      handleDisplayMediumClass(value, option, i);
                                    }}
                                    placeholder="選択してください"
                                    style={{ width: 200 }}
                                  />
                                </Form.Item>
                                <Form.Item name={`group${i}`} label={t('REVIEW_SUMMARY.IDS_SELECT_BOX_GROUP_PERIOD')}>
                                  <Select
                                    options={optionsSelectGroups}
                                    style={{ width: 200 }}
                                    onChange={(value, option) => {
                                      transformChartMediumClass(Number(value), option, i);
                                    }}
                                  ></Select>
                                </Form.Item>
                              </Form>
                            </div>
                            <Row
                              id="chart two"
                              style={{
                                background: 'rgba(0,0,0,0.01)',
                              }}
                            >
                              {results.length > 0 &&
                                results.map((result, index) => {
                                  const mergeMediumclass = result.map((item: any, _j: number) => {
                                    const yearPeriod = `${item.year}年${
                                      item.periodIndex === 1 ? t('IDS_FIRST_PERIOD') : t('IDS_SECOND_PERIOD')
                                    }`;
                                    const classPoints: Record<string, { totalPoints: number; count: number }> = {};

                                    for (const child of item.childrens) {
                                      const { name, totalPoint } = child;

                                      // Kiểm tra nếu mediumClass không được chọn thì bỏ qua
                                      if (!classPoints[name]) {
                                        classPoints[name] = { totalPoints: 0, count: 0 };
                                      }
                                      classPoints[name].totalPoints += totalPoint;
                                    }

                                    // // Tính trung bình cộng
                                    const averages = Object.values(classPoints).map(({ totalPoints }) =>
                                      Number(Math.floor(totalPoints).toFixed(1)),
                                    );

                                    return {
                                      label: yearPeriod,
                                      data: averages,
                                      fill: true,
                                      backgroundColor: colors[_j],
                                      borderColor: borderColors[_j],
                                      pointBackgroundColor: colors[_j],
                                      pointBorderColor: borderColors[_j],
                                      pointHoverBackgroundColor: '#fff',
                                      pointHoverBorderColor: '#fff',
                                      hidden: false,
                                      barThickness: 30,
                                      borderWidth: 3,
                                      pointRadius: 4,
                                    };
                                  }) as dataSets[];

                                  let categories: any[] = [];
                                  if (state.numberGroupPageChart.length === 0) {
                                    categories =
                                      state.groupLargeClasses[i] &&
                                      Object.values(state.groupLargeClasses[i])
                                        .map((child: any) => {
                                          return child.largeClass;
                                        })
                                        .filter((v) => {
                                          return isGroupDeletes.length > 0 ? isGroupDeletes.includes(v) : v;
                                        });
                                  } else {
                                    const mode = state.numberGroupPageChart.find((v) => v.index === i);
                                    if (mode) {
                                      categories =
                                        mode.modeLarge === 1
                                          ? state.groupLargeClasses[i] &&
                                            Object.values(state.groupLargeClasses[i])
                                              .map((child: any) => {
                                                return child.largeClass;
                                              })
                                              .filter((v) => {
                                                return isGroupDeletes.length > 0 ? isGroupDeletes.includes(v) : v;
                                              })
                                          : state.groupMediumClasses[i] &&
                                            Object.values(state.groupMediumClasses[i])
                                              .map((child: any) => {
                                                return child.mediumClass;
                                              })
                                              .filter((v) => {
                                                return isGroupDeletes.length > 0 ? isGroupDeletes.includes(v) : v;
                                              });
                                    } else {
                                      categories =
                                        state.groupLargeClasses[i] &&
                                        Object.values(state.groupLargeClasses[i])
                                          .map((child: any) => {
                                            return child.largeClass;
                                          })
                                          .filter((v) => {
                                            return isGroupDeletes.length > 0 ? isGroupDeletes.includes(v) : v;
                                          });
                                    }
                                  }

                                  const fontSz: any = {};
                                  state.fontSizeGroup.forEach((v) => {
                                    if (v.index === i) {
                                      fontSz[v.index] = v.fontSize;
                                    }
                                  });

                                  const periodNumber = state.numberGroupPageChart.find((v) => v.index === i)?.number;
                                  
                                  return (
                                    <>
                                      <Col
                                        lg={
                                          categories && categories.length < 3 && mergeMediumclass.length > 6 ? 24 : 12
                                        }
                                        xl={
                                          categories && categories.length < 3 && mergeMediumclass.length > 6 ? 24 : 12
                                        }
                                        md={24}
                                        sm={24}
                                        key={`${result.year}-${result.periodIndex}-${index}`} // Sử dụng trường duy nhất
                                        style={{
                                          // border: '1px solid #ccc',
                                          borderTop: '1px solid #ccc',
                                          borderRight: index % 2 === 0 ? '1px solid #ccc' : 'unset',
                                          borderBottom: index === results.length - 2 ? '1px solid #ccc' : 'unset',
                                          boxSizing: 'border-box',
                                          textAlign: 'center',
                                        }}
                                        className={styles.hidden_border}
                                      >
                                        <div
                                          style={{
                                            maxWidth: '500px',
                                            margin: '0 auto',
                                            position: 'relative',
                                            width: 'auto',
                                          }}
                                          className={
                                            categories && categories.length >= 3 ? styles.visibility : styles.hidden
                                          }
                                        >
                                          <MyRadarChart
                                            datas={mergeMediumclass}
                                            categories={categories}
                                            keyValues={`${i}-${index}`}
                                            periodNumber={periodNumber || 0}
                                            countChart={results?.length || 0}
                                          />
                                        </div>
                                        <div
                                          style={{ margin: '0 auto', backgroundColor: 'white' }}
                                          className={
                                            categories && categories.length < 3 ? styles.visibility : styles.hidden
                                          }
                                        >
                                          <MyBarChart
                                            datas={mergeMediumclass}
                                            categories={categories}
                                            keyValues={`${i}-${index}`}
                                            periodNumber={periodNumber || 0}
                                            countChart={results?.length || 0}
                                          />
                                        </div>
                                      </Col>
                                    </>
                                  );
                                })}
                            </Row>
                          </div>
                        </div>
                      </>
                    );
                  })}
              </Card>
            ) : (
              <>
                <Typography.Title
                  style={{
                    marginTop: state.jobType.length === 0 ? '10px' : 0,
                  }}
                  level={5}
                >
                  {t('MESSAGE.COMMON.IDM_EMPTY_DATA')}
                </Typography.Title>
              </>
            )}
          </>
        ) : (
          <>
            <Spin style={{ marginTop: 30 }} />
          </>
        )}
      </div>
      <ModalPopup
        bodyStyle={{
          overflowY: 'auto',
          overflowX: 'hidden',
          maxHeight: 'calc(100vh - 150px)',
          maxWidth: 'calc(100vw - 50px)',
        }}
        metaModal={metaModal}
        setMetaModal={setMetaModal}
        width={'550px'}
        FormModal={<PopupPdfDetail handleCancel={handleCancelPDFDetail} location={location} />}
      />
      <div
        style={{
          position: 'fixed',
          bottom: 10,
          right: 10,
          background: '#025832',
          width: 30,
          height: 30,
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: 16,
          borderRadius: 50,
          zIndex: 9,
          cursor: 'pointer',
        }}
        className={`${styles.icon_scroll_to_top} ${styles.hidden_button_scroll_top}`}
        onClick={scrollToTopPage}
      >
        <ArrowUpOutlined />
      </div>

      {isLoadingOutput && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dim the background
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999, // Ensure it's on top
          }}
        >
          <Spin size="large" tip="Loading PDF..." />
        </div>
      )}

      {isOutputPDF ? (
        <div>
          {' '}
          {/* Tạm thời hiển thị để debug */}
          <PdfFileProfessional
            groupLargeClasses={state.groupLargeClasses}
            groupMediumClasses={state.groupMediumClasses}
            jobTypes={state.jobType}
            listGroupDeletes={state.listGroupDelete}
            location={location}
            numberGroupPageCharts={state.numberGroupPageChart}
            stateGroupMediumClass={state.stateGroupMediumClass}
            t={t}
            stateGroups={stateGroups}
            styles={styles}
            setPdfModal={setPdfModal}
            componentRef={componentRef}
            onChartMounted={handleChartRender} // Truyền hàm callback xuống PdfFileProfessional
          />
        </div>
      ) : (
        <></>
      )}
    </>
  );
};
export default DetailProSkillExpertise;
