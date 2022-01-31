var BSC_MENU_EXAMPLE = [
    {
        class: "kpi-header-logo-ctn",
        style: {
            backgroundColor: 'rgb(100,100, 200)'
        },
        child: [
            {
                tag: "img",
                id: "service_logo_img",

                props: {
                    src: "https://lab.daithangminh.vn/general_images/Logo_Bsc2Kpi_White_H_50.png"
                },
                on: {
                    load: undefined,
                    click: undefined
                }
            },
            {
                localData: {
                    resizeParams: {
                        w: 0,
                        h: 0
                    }
                },
                toggle: undefined
            }
        ]
    },
    {
        text: "BSC",
        items: [
            {
                text: "Thẻ điểm",
                cmd: undefined,
                "data-tutor-id": "mnu_scorecard"
            },
            {
                text: "Bản đồ chiến lược",
                cmd: undefined,
                "data-tutor-id": "mnu_strategic_map"
            },
            {
                text: "Ma trận chức năng",
                cmd: undefined,
                "data-tutor-id": "mnu_functional_matrix"
            }
        ],
        "data-tutor-id": "mnu_bsc"
    },
    {
        text: "Đề xuất",
        "data-tutor-id": "mnu_proposal",
        items: [
            {
                text: "Đề xuất mục tiêu",
                cmd: undefined,
                "data-tutor-id": "mnu_proposal_objective"
            },
            {
                text: "Đề xuất KQ",
                cmd: undefined,
                "data-tutor-id": "mnu_values_proposal"
            }
        ]
    },
    {
        text: "Duyệt",
        "data-tutor-id": "mnu_approve",
        items: [
            {
                text: "Duyệt mục tiêu",
                cmd: undefined,
                "data-tutor-id": "mnu_objective_approve"
            },
            {
                text: "Duyệt kế hoạch thực hiện",
                cmd: undefined,
                "data-tutor-id": "mnu_objective_lines_approve"
            },
            {
                text: "Duyệt kết quả",
                cmd: undefined,
                "data-tutor-id": "mnu_values_approval"
            },
            {
                text: "Duyệt kế hoạch báo cáo",
                cmd: undefined,
                "data-tutor-id": "mnu_plan_report_approval"
            }
        ]
    },
    {
        text: "Báo cáo",
        items: [
            {
                text: "Tổng quan",
                cmd: undefined,
                "data-tutor-id": "mnu_dashboard"
            },
            {
                text: "Báo cáo KPI",
                cmd: undefined,
                "data-tutor-id": "mnu_report_kpi"
            },
            {
                text: "Báo cáo bộ phận, nhân viên",
                cmd: undefined,
                "data-tutor-id": "mnu_report_org_emp",
                items: [
                    { text: "Bộ phận", "data-tutor-id": "org" },
                    { text: "Nhân viên", "data-tutor-id": "emp" },
                ]
            },
            {
                text: "Báo cáo so sánh mục tiêu theo bộ phận, nhân viên",
                cmd: undefined,
                "data-tutor-id": "mnu_report_objective_comparison_by_units_emps"
            },
            {
                text: "Báo cáo so sánh mục tiêu theo KPI",
                cmd: undefined,
                "data-tutor-id": "mnu_report_objective_comparison_by_kpi"
            },
            {
                text: "Hiệu suất",
                cmd: undefined,
                "data-tutor-id": "mnu_performance"
            },
            {
                text: "Báo cáo hiệu suất 12 tháng",
                cmd: undefined,
                "data-tutor-id": "mnu_report_performance_12_months"
            },
            {
                text: "Ma trận bộ phận và KPI",
                cmd: undefined,
                "data-tutor-id": "mnu_kpi_unit_matrix"
            },
            {
                text: "Báo cáo hiệu suất và năng lực nhân viên",
                cmd: undefined,
                "data-tutor-id": "mnu_report_9_cell_matrix"
            },
            {
                text: "Báo cáo định vị tăng lương",
                cmd: undefined,
                "data-tutor-id": "mnu_report_wage_positioning"
            },
            {
                text: "Map profile",
                cmd: undefined,
                "data-tutor-id": "mnu_map_profile"
            },
            {
                text: "Báo cáo cập nhật KPI",
                cmd: undefined,
                "data-tutor-id": "mnu_report_update_kpi"
            },
            {
                text: "Hướng dẫn tự học",
                cmd: undefined,
                "data-tutor-id": "mnu_tutorials_report"
            }
        ],
        "data-tutor-id": "mnu_report"
    },
    {
        text: "Danh mục",
        items: [
            {
                text: "KPI",
                cmd: undefined,
                "data-tutor-id": "mnu_kpi"
            },
            {
                text: "Sơ đồ tổ chức",
                cmd: undefined,
                "data-tutor-id": "mnu_organization_chart"
            },
            {
                text: "Viễn cảnh",
                cmd: undefined,
                "data-tutor-id": "mnu_perspective"
            },
            {
                text: "Công thức tính",
                cmd: undefined,
                "data-tutor-id": "mnu_formula"
            },
            {
                text: "Ngôn ngữ",
                cmd: undefined,
                "data-tutor-id": "mnu_language"
            },
            {
                text: "Hồ sơ BSC",
                cmd: undefined,
                "data-tutor-id": "mnu_profilename"
            }
        ],
        "data-tutor-id": "mnu_list"
    },
    {
        text: "Hệ thống",
        items: [
            {
                text: "Người dùng",
                cmd: undefined,
                "data-tutor-id": "mnu_user"
            },
            {
                text: "Nhóm người dùng",
                cmd: undefined,
                "data-tutor-id": "mnu_user_groups"
            },
            "======",
            {
                text: "Tùy chọn",
                cmd: undefined,
                "data-tutor-id": "mnu_options"
            },
            {
                text: "Mở khóa kế hoạch thực hiện",
                cmd: undefined,
                "data-tutor-id": "mnu_unlock_objective_details"
            },
            {
                text: "Sao lưu và phục hồi",
                cmd: undefined,
                "data-tutor-id": "mnu_back_up_and_restore"
            },
            "=====",
            {
                text: "Undo",
                cmd: undefined,
                "data-tutor-id": "mnu_undo"
            },
            "=====",
            {
                text: "Hồ sơ cá nhân",
                cmd: undefined,
                "data-tutor-id": "mnu_personal_profile"
            },
            {
                text: "Đăng xuất",
                cmd: undefined,
                "data-tutor-id": "mnu_logout"
            }
        ],
        "data-tutor-id": "mnu_system"
    },
    {
        text: "Hỗ trợ",
        "data-tutor-id": "mnu_support",
        items: [
            {
                text: "Hướng dẫn sử dụng",
                cmd: undefined,
                "data-tutor-id": "mnu_help"
            },
            {
                text: "Hướng dẫn tự học",
                cmd: undefined,
                "data-tutor-id": "mnu_tutorials"
            },
            {
                text: "Hỗ trợ trực tuyến",
                cmd: undefined,
                "data-tutor-id": "mnu_online_support"
            }
        ]
    },
    {
        text: "admin",
        "data-tutor-id": "mnu_username",
        items: [
            {
                localData: {
                    resizeParams: {
                        w: 0,
                        h: 0
                    }
                },
                toggle: undefined
            },
            {
                text: "Hồ sơ cá nhân",
                cmd: undefined,
                "data-tutor-id": "mnu_personal_profile"
            },
            {
                text: "Đăng xuất",
                cmd: undefined,
                "data-tutor-id": "mnu_logout"
            }
        ]
    }
]