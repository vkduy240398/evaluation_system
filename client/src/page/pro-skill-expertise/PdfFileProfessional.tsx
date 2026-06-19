// PdfFileProfessional.tsx
import React from 'react';
import { Card, Col, Row, Typography } from 'antd';
import InfomationEmployee from '../../views/admin-evaluation/pro-skill-expertise/InfomationEmployee';
import { TFunction } from 'i18next';
import { professionalExpertise } from '../../types/api/proSkillSetting';
import ReactApexChart from 'react-apexcharts';
import { transformCategories } from '../../common/util';

interface Props {
  jobTypes: professionalExpertise[];
  numberGroupPageCharts: {
    number: number;
    index: number;
    modeLarge: number;
  }[];
  location: {
    yearStart: string;
    yearEnd: string;
    departmentName: string;
    divisionName: string;
    employeeNumber: string;
    userName: string;
    level: number;
  };
  t: TFunction<'translation', undefined, 'translation'>;
  stateGroupMediumClass: { value: string; label: string; children: any[] }[][];
  groupMediumClasses: { value: string; label: string }[] | any[];
  groupLargeClasses: { value: string; label: string }[] | any[];
  listGroupDeletes: { [x: string]: string }[];
  stateGroups: any[];
  styles: any;
  setPdfModal: React.Dispatch<
    React.SetStateAction<{
      isOpen: boolean;
    }>
  >;
  componentRef: any;
  onChartMounted: () => void; // New prop to signal that a chart has mounted
}

const PdfFileProfessional = (props: Props) => {
  const {
    jobTypes,
    numberGroupPageCharts,
    location,
    t,
    groupMediumClasses,
    groupLargeClasses,
    listGroupDeletes,
    stateGroups,
    styles,
    componentRef,
    onChartMounted, // Destructure the new prop
  } = props;

  // Hàm để gán ref cho từng phần

  return (
    <>
      <div ref={componentRef} style={{ margin: 15 }}>
        <Card className="IsExportPDF_modal container-pdf" style={{ marginBottom: 30 }}>
          <Typography.Title level={3}>{t('REVIEW_SUMMARY.IDS_TITLE_INFOR_USER_OF_SUMMARY')}</Typography.Title>
          <InfomationEmployee
            period={`${location && location.yearStart} ~ ${location && location.yearEnd}`}
            departmentName={location && location.departmentName?.replace('\n', t('IDS_COMMA'))}
            divisionName={location && location.divisionName.replaceAll('IDS_COMMA', t('IDS_COMMA'))}
            employeeNumber={location && location.employeeNumber}
            fullName={location && location.userName}
            level={location && location.level}
            t={t}
          />
        </Card>
        {jobTypes &&
          jobTypes.map((v, i) => {
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
            const isGroupDeletes: any = listGroupDeletes[i] ? listGroupDeletes[i] : [];
            const filterLarges = Object.values(large).map((v) => {
              if (listGroupDeletes[i] && isGroupDeletes.length > 0) {
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
              if (listGroupDeletes[i] && isGroupDeletes.length > 0) {
                if (listGroupDeletes[i] && isGroupDeletes.length > 0) {
                  return {
                    ...v,
                    childrens: v.childrens.filter((v: any) => isGroupDeletes.includes(v.name)),
                  };
                }
              }

              return v;
            });
            mergeYearPeriodMediumClassfications[`${i}`] = [Object.values(filterLarges), Object.values(filterMediums)];

            // cắt nhỏ năm ra
            // Không có page size và không có chia mục hiển thị (mode)
            const results: any[] = [];
            const mode: any = numberGroupPageCharts.find((v) => v.index === i);
            if (numberGroupPageCharts.length === 0) {
              const pageSize = 1;
              for (let j = 0; j < Object.keys(mergeYearPeriodMediumClassfications[i][0]).length; j += pageSize) {
                results.push(Object.values(mergeYearPeriodMediumClassfications[i][0]).slice(j, j + pageSize));
              }
            } else {
              // Kiểm tra trong state có index này không
              if (numberGroupPageCharts.find((v) => v.index === i)) {
                // Nếu có thì sẽ lấy number này làm page size
                const foundNumber = numberGroupPageCharts.find((v) => v.index === i)?.number;

                if (mode.modeLarge === 1) {
                  const pageSize = Math.ceil(
                    foundNumber !== undefined && foundNumber !== -1
                      ? Math.floor(foundNumber)
                      : Object.values(mergeYearPeriodMediumClassfications[i][0]).length,
                  );
                  for (let j = 0; j < Object.keys(mergeYearPeriodMediumClassfications[i][0]).length; j += pageSize) {
                    results.push(Object.values(mergeYearPeriodMediumClassfications[i][0]).slice(j, j + pageSize));
                  }
                } else {
                  const pageSize = Math.ceil(
                    foundNumber !== undefined && foundNumber !== -1
                      ? Math.floor(foundNumber)
                      : Object.values(mergeYearPeriodMediumClassfications[i][1]).length,
                  );
                  for (let j = 0; j < Object.keys(mergeYearPeriodMediumClassfications[i][1]).length; j += pageSize) {
                    results.push(Object.values(mergeYearPeriodMediumClassfications[i][1]).slice(j, j + pageSize));
                  }
                }
              } else {
                // Không tìm thấy index sẽ lấy page number = 1
                const pageSize = Math.ceil(Math.floor(1));
                for (let j = 0; j < Object.keys(mergeYearPeriodMediumClassfications[i][0]).length; j += pageSize) {
                  results.push(Object.values(mergeYearPeriodMediumClassfications[i][0]).slice(j, j + pageSize));
                }
              }
            }

            const chunkSize = 2;
            const sliceRows = [];
            for (let index = 0; index < results.length; index += chunkSize) {
              sliceRows.push(results.slice(index, index + chunkSize));
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

            const borderColorsRGBA = [
              'rgba(0, 143, 251, 0.6)', // Màu 1
              'rgba(0, 227, 150, 0.6)', // Màu 2
              'rgba(254, 176, 25, 0.6)', // Màu 3
              'rgba(255, 69, 96, 0.6)', // Màu 4
              'rgba(119, 93, 208, 0.6)', // Màu 5
              'rgba(141, 220, 255, 0.6)', // Màu 6
              'rgba(255, 152, 122, 0.6)', // Màu 7
              'rgba(107, 107, 107, 0.6)', // Màu 8
              'rgba(176, 217, 176, 0.6)', // Màu 9
              'rgba(255, 182, 193, 0.6)', // Màu 10
              'rgba(173, 216, 230, 0.6)',
              'rgba(255, 215, 0, 0.6)',
            ];
            const borderColors = [
              '#008FFB', // Màu 1
              '#00E396', // Màu 2
              '#FEB019', // Màu 3
              '#FF4560', // Màu 4
              '#775DD0', // Màu 5
              '#8DDCFF', // Màu 6
              '#FF987A', // Màu 7
              '#6B6B6B', // Màu 8
              '#B0D9B0', // Màu 9
              '#FFB6C1', // Màu 10 (Thêm nhiều màu nếu series của bạn có nhiều hơn)
              '#ADD8E6',
              '#FFD700',
            ];

            // Hiển thị values combobox
            let listLarges: any[] = [];
            if (numberGroupPageCharts.length === 0) {
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
                if (mode.modeLarge === 1) {
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
                    pageBreakBefore: i !== 0 ? 'always' : 'unset',
                  }}
                  key={`${v.jobType}-${i}-${Math.floor(Math.random()).toString()}`}
                  id={`${v.jobType}`}
                  className="container-pdf"
                >
                  <div className={'your-background-class'} style={{ background: '#025832' }}>
                    <Typography.Title
                      level={5}
                      style={{ fontWeight: 'normal', padding: '5px 10px', color: '#fff', margin: 0 }}
                    >
                      <b> {`${i + 1}. ${v.jobType}`}</b>
                    </Typography.Title>
                  </div>
                  <div id="chart" className="container-pdf">
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
                        <div>
                          <ReactApexChart
                            series={[
                              {
                                name: v.jobType,
                                data: v.childrens.map((child) => child.totalPoint),
                              },
                            ]}
                            options={{
                              chart: {
                                type: 'bar',
                                height: 350,
                                toolbar: {
                                  show: false,
                                },
                                events: {
                                  mounted: () => {
                                    onChartMounted();
                                  },
                                },
                              },
                              plotOptions: {
                                bar: {
                                  horizontal: false,
                                  columnWidth: '40px',
                                  borderRadius: 3,
                                  borderRadiusApplication: 'end',

                                  dataLabels: {
                                    position: 'center', // top, center, bottom
                                  },
                                  colors: {
                                    ranges: [
                                      {
                                        from: 0,
                                        to: 25,
                                        color: 'rgba(99, 154, 255, 0.6)',
                                      },
                                    ],
                                  },
                                },
                              },
                              dataLabels: {
                                enabled: true,
                                formatter: function (val: any) {
                                  return val;
                                },
                                style: {
                                  fontSize: '10px',
                                  colors: ['#000000'], // Đặt màu chữ thành đen ở đây
                                },
                              },
                              stroke: {
                                show: true,
                                width: 1,
                                colors: ['rgba(99, 154, 255, 0.6)'],
                              },
                              grid: {
                                borderColor: '#ddd', // Màu lưới
                                yaxis: {
                                  lines: {
                                    show: true, // Hiện lưới cho trục y
                                  },
                                },
                                xaxis: {
                                  lines: {
                                    show: false, // Hiện lưới cho trục x
                                  },
                                },
                              },
                              xaxis: {
                                categories: v.childrens.map((child) => {
                                  return `${child.year}${
                                    child.periodIndex === 1
                                      ? t('IDS_FIRST_PERIOD_WITH_YEAR')
                                      : t('IDS_SECOND_PERIOD_WITH_YEAR')
                                  }`;
                                }),
                              },
                              yaxis: {
                                show: true,
                                labels: {
                                  style: {
                                    colors: ['#000'],
                                  },
                                },
                                axisBorder: {
                                  show: true,
                                },
                                max: 25,
                              },
                              fill: {
                                opacity: 1,
                              },
                              tooltip: {
                                enabled: false,
                              },

                              legend: {
                                show: true,
                                position: 'bottom', // Vị trí của legend
                                horizontalAlign: 'center', // Căn giữa
                                floating: false,
                                itemMargin: {
                                  horizontal: 10, // Khoảng cách giữa các mục
                                  vertical: 10, // Khoảng cách giữa các hàng
                                },
                                labels: {
                                  colors: '#007240',
                                },
                                fontSize: '10',
                                onItemClick: {
                                  toggleDataSeries: false,
                                },
                              },
                            }}
                            type="bar"
                            height={350}
                            width={'100%'}
                          />
                        </div>
                      </Col>
                    </Row>
                  </div>
                  <Typography.Title
                    className="container-pdf"
                    level={4}
                    style={{ marginBottom: '10px', fontWeight: 'bold', padding: '5px 10px' }}
                  >
                    {t('REVIEW_SUMMARY.IDS_MEDIUM_CLASS_LIST')}
                  </Typography.Title>
                  {sliceRows.map((rows, j) => {
                    return (
                      <>
                        <Row
                          className="container-pdf"
                          style={{
                            border: '1px solid #ccc',
                            borderBottom: j % 2 === 0 ? '1px solid #ccc' : 'unset',
                            borderTop: j % 2 === 0 ? '1px solid #ccc' : 'unset',
                          }}
                        >
                          {rows.length > 0 &&
                            rows.map((result, index) => {
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
                                  name: yearPeriod,
                                  data: averages,
                                };
                              });

                              let categories: any[] = [];
                              if (numberGroupPageCharts.length === 0) {
                                categories =
                                  groupLargeClasses[i] &&
                                  Object.values(groupLargeClasses[i])
                                    .map((child: any) => {
                                      return child.largeClass;
                                    })
                                    .filter((v) => {
                                      return isGroupDeletes.length > 0 ? isGroupDeletes.includes(v) : v;
                                    });
                              } else {
                                const mode = numberGroupPageCharts.find((v) => v.index === i);
                                if (mode) {
                                  categories =
                                    mode.modeLarge === 1
                                      ? groupLargeClasses[i] &&
                                        Object.values(groupLargeClasses[i])
                                          .map((child: any) => {
                                            return child.largeClass;
                                          })
                                          .filter((v) => {
                                            return isGroupDeletes.length > 0 ? isGroupDeletes.includes(v) : v;
                                          })
                                      : groupMediumClasses[i] &&
                                        Object.values(groupMediumClasses[i])
                                          .map((child: any) => {
                                            return child.mediumClass;
                                          })
                                          .filter((v) => {
                                            return isGroupDeletes.length > 0 ? isGroupDeletes.includes(v) : v;
                                          });
                                } else {
                                  categories =
                                    groupLargeClasses[i] &&
                                    Object.values(groupLargeClasses[i])
                                      .map((child: any) => {
                                        return child.largeClass;
                                      })
                                      .filter((v) => {
                                        return isGroupDeletes.length > 0 ? isGroupDeletes.includes(v) : v;
                                      });
                                }
                              }
                              const colorsTexts =
                                categories &&
                                categories.map((_v) => {
                                  return '#717171';
                                });

                              return (
                                <>
                                  <Col
                                    lg={categories && categories.length < 3 && mergeMediumclass.length > 6 ? 18 : 12}
                                    xl={categories && categories.length < 3 && mergeMediumclass.length > 6 ? 18 : 12}
                                    md={12}
                                    sm={12}
                                    key={`${result.year}-${result.periodIndex}-${index}`} // Sử dụng trường duy nhất
                                    style={{
                                      boxSizing: 'border-box',
                                      textAlign: 'center',
                                      padding: '0 !important',
                                      borderRight: 'unset',
                                    }}
                                  >
                                    <div
                                      style={{ maxWidth: 'auto', margin: '0 auto', position: 'relative' }}
                                      className={
                                        categories && categories.length >= 3 ? styles.visibility : styles.hidden
                                      }
                                    >
                                      <ReactApexChart
                                        series={mergeMediumclass}
                                        options={{
                                          chart: {
                                            type: 'radar',
                                            toolbar: { show: false },
                                            events: {
                                              mounted: onChartMounted, // Use 'mounted' here
                                            },
                                          },
                                          dataLabels: {
                                            enabled: true,
                                            style: {
                                              colors: borderColors,
                                            },
                                          },
                                          tooltip: {
                                            enabled: false,
                                          },
                                          colors: borderColors,
                                          xaxis: {
                                            categories: transformCategories(categories),
                                            axisBorder: {
                                              show: true,
                                              strokeWidth: 2, // Độ dày của border
                                            },
                                            labels: {
                                              style: {
                                                colors: colorsTexts,
                                                fontWeight: 600,
                                                fontSize: '10',
                                              },
                                            },
                                          },
                                          markers: {
                                            size: 4,
                                            strokeWidth: 1,
                                            strokeColors: borderColors,
                                          },
                                          fill: {},
                                          stroke: {
                                            colors: borderColors,
                                          },
                                          yaxis: { min: 0, max: 25 },
                                          title: {
                                            text: `${
                                              mergeMediumclass.length > 1
                                                ? `${mergeMediumclass[0].name} - ${
                                                    mergeMediumclass[mergeMediumclass.length - 1].name
                                                  }`
                                                : mergeMediumclass[0].name
                                            }`,
                                            align: 'center',
                                            floating: false,
                                            offsetY: 0,
                                            style: {
                                              color: 'black',
                                              fontSize: '10',
                                              fontWeight: 500,
                                            },
                                          },
                                          responsive: [
                                            {
                                              breakpoint: 1300,
                                              options: {
                                                chart: {
                                                  height: 500,
                                                },
                                              },
                                            },
                                            {
                                              breakpoint: 2000,
                                              options: {
                                                chart: {
                                                  height: result.length > 5 ? 600 : 500,
                                                },
                                              },
                                            },
                                          ],
                                          legend: {
                                            show: true,
                                            position: 'bottom', // Vị trí của legend
                                            horizontalAlign: 'center', // Căn giữa
                                            floating: false,
                                            showForNullSeries: true,
                                            itemMargin: {
                                              horizontal: 10, // Khoảng cách giữa các mục
                                              vertical: 10, // Khoảng cách giữa các hàng
                                            },
                                            labels: {
                                              colors: '#007240',
                                            },
                                            fontSize: '10px',
                                            onItemClick: {
                                              toggleDataSeries: false,
                                            },
                                          },
                                        }}
                                        type="radar"
                                      />
                                    </div>
                                    <div
                                      style={{ margin: '0 auto' }}
                                      className={
                                        categories && categories.length < 3 ? styles.visibility : styles.hidden
                                      }
                                    >
                                      <ReactApexChart
                                        series={mergeMediumclass}
                                        options={{
                                          chart: {
                                            type: 'bar',
                                            toolbar: { show: false },
                                            events: {
                                              mounted: onChartMounted, // Use 'mounted' here
                                            },
                                          },
                                          dataLabels: {
                                            enabled: true,
                                            formatter: function (val) {
                                              if (val === 0) {
                                                return '0'; // Hiển thị số 0
                                              }

                                              return val; // Với các giá trị khác, hiển thị giá trị bình thường
                                            },
                                            style: {
                                              colors: ['#333'],
                                            },
                                          },
                                          tooltip: {
                                            enabled: false,
                                          },
                                          colors: borderColorsRGBA,
                                          xaxis: {
                                            categories: categories,
                                            axisBorder: {
                                              show: true,
                                              strokeWidth: 2, // Độ dày của border
                                            },
                                            labels: {
                                              style: {
                                                colors: 'black',
                                                fontSize: '10',
                                              },
                                            },
                                          },
                                          stroke: {
                                            colors: borderColorsRGBA,
                                            width: 1,
                                          },
                                          plotOptions: {
                                            bar: {
                                              horizontal: false,
                                              columnWidth: '40px',
                                              borderRadius: 3,
                                              dataLabels: {
                                                position: 'center', // top, center, bottom
                                              },
                                            },
                                          },
                                          markers: {
                                            size: 4,
                                            strokeWidth: 1,
                                            strokeColors: borderColorsRGBA,
                                          },
                                          fill: {},
                                          yaxis: { min: 0, max: 25 },
                                          title: {
                                            text: `${
                                              mergeMediumclass.length > 1
                                                ? `${mergeMediumclass[0].name} - ${
                                                    mergeMediumclass[mergeMediumclass.length - 1].name
                                                  }`
                                                : mergeMediumclass[0].name
                                            }`,
                                            align: 'center',
                                            floating: false,
                                            offsetY: 0,
                                            style: {
                                              color: 'black',
                                              fontSize: '10',
                                              fontWeight: 500,
                                            },
                                          },
                                          responsive: [
                                            {
                                              breakpoint: 1300,
                                              options: {
                                                chart: {
                                                  height: 300,
                                                },
                                              },
                                            },
                                            {
                                              breakpoint: 2000,
                                              options: {
                                                chart: {
                                                  height: 300,
                                                },
                                              },
                                            },
                                          ],
                                          legend: {
                                            show: true,
                                            position: 'bottom', // Vị trí của legend
                                            horizontalAlign: 'center', // Căn giữa
                                            floating: false,
                                            showForNullSeries: true,
                                            itemMargin: {
                                              horizontal: 10, // Khoảng cách giữa các mục
                                              vertical: 10, // Khoảng cách giữa các hàng
                                            },
                                            labels: {
                                              colors: '#007240',
                                            },
                                            fontSize: '10',
                                            onItemClick: {
                                              toggleDataSeries: false,
                                            },
                                          },
                                        }}
                                        type="bar"
                                      />
                                    </div>
                                  </Col>
                                </>
                              );
                            })}
                        </Row>
                      </>
                    );
                  })}
                </div>
              </>
            );
          })}
      </div>
    </>
  );
};

export default PdfFileProfessional;
