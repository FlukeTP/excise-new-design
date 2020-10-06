(function( $ ) {
    $.fn.DataTableTh = function(options) {
        var opt = {
            ordering: false,
            searching: false,
            scrollX: true,
            language: {
                info: "แสดงจาก  _START_  ถึง  _END_  จากทั้งหมด  _TOTAL_  รายการ",
                paginate: {
                  first: "หน้าแรก",
                  last: "หน้าสุดท้าย",
                  next: "ถัดไป",
                  previous: "ก่อนหน้า"
                },
                lengthMenu: "แสดง _MENU_ รายการ",
                loadingRecords: "กำลังโหลด...",
                processing: "กำลังประมวลผล...",
                search: "ค้นหาทั้งหมด",
                infoEmpty: "แสดงจาก 0  ถึง  0  จากทั้งหมด  0  รายการ",
                emptyTable: "ไม่พบข้อมูล",
                zeroRecords: "ไม่พบข้อมูล",
                infoFiltered: "(ค้นหาจากทั้งหมด  _MAX_  รายการ)",
              },
              "dom":  "<'ui stackable grid'" +
                        "<'row'"+
                          "<'clear'>"+
                        ">"+
                        "<'row dt-table'"+
                          "<'sixteen wide column'tr>"+
                          ">"+
                        "<'row'"+
                          "<'left aligned five wide column'l>"+
                          "<'center aligned six wide column'i>"+
                          "<'right aligned five wide column'p>"+
                          
                        ">"+
                      ">"
        };
        var settings = $.extend( opt ,options);
  
       return  $(this).DataTable(settings);
    };
  })( jQuery );