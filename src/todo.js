$(function(){

    function LoadView(url){
        $.ajax({
            method:"get",
            url:url,
            success: (response)=>{
                $("section").html(response);
            }
        })
    }

    LoadView("../public/home.html");


    $(document).on("click","#btnCreateAccount",()=>{
        LoadView("../public/user-register.html");
 
    })

    $(document).on("click", "#btnCancel", ()=>{
        LoadView("../public/home.html");
    })

    $(document).on("click", "#btnSignin", ()=>{
        LoadView("../public/user-login.html");
    })

    $(document).on("click", "#btnRegister",()=>{
        var user = {
            UserId: $("#txtRUserId").val(),
            UserName: $("#txtRUserName").val(),
            Password: $("#txtRPassword").val(),
            Email: $("#txtREmail").val(),
            Mobile: $("#txtRMobile").val()
        };

        $.ajax({
            method: "post",
            url: "http://127.0.0.1:4040/register-user",
            data: user

        })

        alert("Registered Successfully..");
        LoadView("../public/user-login.html");
    })

    $(document).on("keyup", "#txtRUserId", (e)=>{

        $.ajax({
            method:"get",
            url: "http://127.0.0.1:4040/users",
            success: (users=>{
                for(var user of users) {
                    if(user.UserId===e.target.value) {
                        $("#lblUserIdError").html('User Id Taken - Try Another').addClass('text-danger');
                        break;
                    }
                    else {
                        $("#lblUserIdError").html('User Id Available').addClass('text-success');
                    }
                }

            })
        })
    });

    function GetAppointments(userId){
        $.ajax({
            method:"get",
            url: `http://127.0.0.1:4040/get-appointments/${userId}`,
            success: (appointments=>{
                $("#lblUserId").html($.cookie("username"));
                appointments.map(appointment=>{
                    $(`
                     
                        <div class="alert bg-success alert-dismissible m-4 " >
                        <button class="btn btn-close" data-bs-dismiss="alert" > </button>
                        <h3> ${appointment.Title} </h3>
                        <p> ${appointment.Description}</P>
                        <p> ${appointment.Date} </p>
                        <p> ${$.cookie("username")} </P>
                        <button value=${appointment.AppointmentId} id="btnEdit" class="btn btn-warning bi bi-pen-fill" >Edit</button>
                        <button value=${appointment.AppointmentId} id="btnDelete" class="btn btn-danger bi bi-trash-fill" >Delete</button
                        </div>
                        `).appendTo("#appointmentsContainer");
                })
            })
        })
    }

    $(document).on("click", "#btnLogin", ()=>{

        var userid = $("#txtLoginUserId").val();
        var password = $("#txtLoginPassword").val();

        $.ajax({
            method: "get",
            url: "http://127.0.0.1:4040/users",
            success: (users=>{
                var user = users.find(record=> record.UserId===userid);
                if(user) {
                    if(user.Password===password) {

                        $.cookie("userid", userid);
                        $.cookie("username", user.UserName);
                        LoadView("../public/user-dashboard.html");
                        GetAppointments(userid);


                        

                    }
                    else {
                        alert("Invalid Password");
                    }
                 
                }
                else {
                    alert ("Invalid User Id");
                }
            })
        })
    });

    $(document).on("click", "#btnSignout", ()=>{
        $.removeCookie('userid');
        $.removeCookie('username');

        LoadView("../public/user-login.html");
    })

    $(document).on("click", "#btnNewAppointment", ()=>{
        LoadView("../public/add-appointment.html");

    })

    $(document).on("click", "#btnAdd", ()=>{

        var appointment = {
            AppointmentId: $("#txtId").val(),
            Title: $("#txtTitle").val(),
            Description: $("#txtDescription").val(),
            Date: $("#txtDate").val(),
            Time: $("#txtDate").val(),
            UserId: $.cookie("userid")

        }
        $.ajax({
            method: "post",
            url: "http://127.0.0.1:4040/add-appointment",
            data: appointment

        })
        alert('Appointment Added successfully.. ');
        LoadView("../public/user-dashboard.html");
        GetAppointments($.cookie('userid'));

    });

    $(document).on("click", "#btnEdit", (e)=>{
        LoadView("../public/edit-appointment.html");

        $.ajax({
            method: "get",
            url: `http://127.0.0.1:4040/get-appointment/${e.target.value}`,
            success: (appointment) =>{
                $("#txtId").val(appointment.AppointmentId);
                $("#txtTitle").val(appointment.Title);
                $("#txtDescription").val(appointment.Description);

                var str = appointment.Date;
                var d = str.slice(0,str.indexOf("T"));
                var t = str.slice(str.indexOf("T")+1, str.length-1 );

                $("#txtDate").val(`${d} ${t}`);
            }
        })

    });

    $(document).on("click", "#btnEditCancel", ()=>{

        LoadView("../public/user-dashboard.html");
        GetAppointments($.cookie('userid'));

    });

    $(document).on("click", "#btnSave", ()=>{

        var appointment = {
            AppointmentId: $("#txtId").val(),
            Title: $("#txtTitle").val(),
            Description: $("#txtDescription").val(),
            Date: $("#txtDate").val(),
            Time: $("#txtDate").val(),
            UserId: $.cookie("userid")

        }
        $.ajax({
            method: "put",
            url: `http://127.0.0.1:4040/edit-appointment/${$("#txtId").val()}`,
            data: appointment

        })
        alert('Appointment Updated successfully.. ');
        LoadView("../public/user-dashboard.html");
        GetAppointments($.cookie('userid'));

    });

    $(document).on("click", "#btnDelete", (e)=>{
        LoadView("../public/delete-appointment.html");

        $.ajax({
            method: "get",
            url: `http://127.0.0.1:4040/get-appointment/${e.target.value}`,
            success: (appointment) =>{

                $("#lblTitle").html(appointment.Title);
                $("#lblDescription").html(appointment.Description);
                $("#txtId").val(appointment.AppointmentId);


            }
        })

    });

    $(document).on("click", "#btnconfirmDelete", ()=>{
        $.ajax({
            method: "delete",
            url: `http://127.0.0.1:4040/delete-appointment/${$("#txtId").val()}`
        })
        alert("Appointment Deleted Successfully");
        LoadView("../public/user-dashboard.html");
        GetAppointments($.cookie('userid'));

    })
})