/**
 * Created by sniyve on 2016/4/16.
 */
$(function(){
    $.countDown(Calendar.getInstance('20160416 200000').getTime(),{
        sec: $("#seconds"),
        mini: $("#minute"),
        hour: $("#hour"),
        day: $("#day"),
        month: $("#month"),
        year: $("#year")
    });
    $.countDown(Calendar.getInstance('20160417 220455').getTime(),{
        sec: $("#seconds2"),
        mini: $("#minute2"),
        hour: $("#hour2"),
        day: $("#day2"),
        month: $("#month2"),
        year: $("#year2")
    });
    $.countDown(Calendar.getInstance('20160417 210454').getTime(),{
        sec: $("#seconds3"),
        mini: $("#minute3"),
        hour: $("#hour3"),
        day: $("#day3"),
        month: $("#month3"),
        year: $("#year3")
    });
    $.countDown(Calendar.getInstance('20160418 220453').getTime(),{
        sec: $("#seconds4"),
        mini: $("#minute4"),
        hour: $("#hour4"),
        day: $("#day4"),
        month: $("#month4"),
        year: $("#year4")
    });
    $.countDown(Calendar.getInstance('20160419 220452').getTime(),{
        sec: $("#seconds5"),
        mini: $("#minute5"),
        hour: $("#hour5"),
        day: $("#day5"),
        month: $("#month5"),
        year: $("#year5")
    });
    $.countDown(Calendar.getInstance('20160517 220451').getTime(),{
        sec: $("#seconds6"),
        mini: $("#minute6"),
        hour: $("#hour6"),
        day: $("#day6"),
        month: $("#month6"),
        year: $("#year6")
    });

    Event.subscribe('TIMER',function(){
        $('#now').html(Calendar.getInstance().format('yyyy年MM月dd日 hh:mm:ss')+'<br>'+'截止至'+Calendar.getInstance('20160416 200000').format('yyyy年MM月dd日 hh:mm:ss'));
        $('#now2').html(Calendar.getInstance().format('yyyy年MM月dd日 hh:mm:ss')+'<br>'+'截止至'+Calendar.getInstance('20160417 220455').format('yyyy年MM月dd日 hh:mm:ss'));
    })
});