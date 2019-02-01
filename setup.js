var $jscomp=$jscomp||{};$jscomp.scope={};$jscomp.arrayIteratorImpl=function(a){var b=0;return function(){return b<a.length?{done:!1,value:a[b++]}:{done:!0}}};$jscomp.arrayIterator=function(a){return{next:$jscomp.arrayIteratorImpl(a)}};$jscomp.makeIterator=function(a){var b="undefined"!=typeof Symbol&&Symbol.iterator&&a[Symbol.iterator];return b?b.call(a):$jscomp.arrayIterator(a)};$jscomp.arrayFromIterator=function(a){for(var b,d=[];!(b=a.next()).done;)d.push(b.value);return d};
$jscomp.arrayFromIterable=function(a){return a instanceof Array?a:$jscomp.arrayFromIterator($jscomp.makeIterator(a))};var modal_container=$("#modal-container"),sidebar=$("#sidebar"),papers,thumbnails=[],min_filter_year,max_filter_year,min_year,max_year,max_year_val,search_text="",annual_totals,g,x,y,hist_width,hist_height,categories,topics,icons,current_tooltip_year,min_title_length=75,select_mode="union",summary_sort_options,hidden_svg=d3.select("#modal-hidden-sandbox");
function setup(a){$.when($.get("data/topics.json"),$.get("data/categories.json"),$.get("data/papers.json")).done(function(b,d,e){topics=b[0];categories=d[0];papers=e[0];papers.sort(function(a,f){return a.pub_year!=f.pub_year?f.pub_year-a.pub_year:f.title.localeCompare(a.title)});icons=[];for(var h in categories)for(var f in categories[h].categories)icons.push(createTopicIcon(h,f));citation_total=papers.length;annual_totals={};for(var c in papers)papers[c].link="https://doi.org/"+papers[c].doi,papers[c].thumbnail_link=
"img/"+(papers[c].thumbnail_link?papers[c].thumbnail_link:"placeholder.jpg"),papers[c].authors=papers[c].authors.replace(/;/g,","),papers[c].short_name=(papers[c].short_name?papers[c].short_name:papers[c].title)+" ("+papers[c].pub_year+")",papers[c].full_title=papers[c].title+" ("+papers[c].pub_year+")",papers[c].min_title=papers[c].short_name.length<min_title_length-10?papers[c].short_name:papers[c].title.slice(0,min_title_length-10)+"... ("+papers[c].pub_year+")",papers[c].id=papers[c].doi.replace(/[./]/g,
""),modal_container.append(createPaperModal(papers[c])),thumbnails.push(createPaperThumbnail(papers[c])),b=papers[c].pub_year,b in annual_totals||(annual_totals[b]={current:0,total:0}),annual_totals[b].current++,annual_totals[b].total++,max_year_val=Math.max(annual_totals[b].total);min_year=Math.min.apply(Math,$jscomp.arrayFromIterable(Object.keys(annual_totals)));max_year=Math.max.apply(Math,$jscomp.arrayFromIterable(Object.keys(annual_totals)));min_filter_year=min_year;max_filter_year=max_year;
selected_categories={};for(var k in categories){c={};for(h in categories[k].categories)c[categories[k].categories[h].name]=!0;selected_categories[k]=c}createUI();createSummaryGrid();a()})}
function createUI(){(function(a){a.fn.hasScrollBar=function(){return this.get(0).scrollHeight>this.innerHeight()}})(jQuery);$("#side-search").on("input",function(){search_text=$(this).val();updateUI()});$("#side-search-clear").click(function(){search_text="";$("#side-search").val("");updateUI()});$("#side-histogram-slider").slider({range:!0,min:min_year,max:max_year,values:[min_filter_year,max_filter_year],step:1,slide:function(){setTimeout(function(){min_filter_year=parseInt($("#side-histogram-slider").slider("values",
0));max_filter_year=parseInt($("#side-histogram-slider").slider("values",1));updateUI()},10)}});addCloseButtonToModal(".modal");$(window).resize(updateDynamicComponents);var a=$("#side-topic-filter"),b;for(b in categories){var d=$("<h5>",{"class":"topic-"+b});d.text(categories[b].display);var e=$("<span>",{"class":"toggle-select fa fa-check-square-o"});e.click(function(){var a=$(this);a.toggleClass("fa-square-o");a.toggleClass("fa-check-square-o");a.hasClass("fa-square-o")?a.parent().nextUntil("h5").removeClass("category-icon-selected"):
a.parent().nextUntil("h5").addClass("category-icon-selected");updateUI()});d.append(e);a.append(d);for(var h in categories[b].categories)d=createTopicIcon(b,h),d.click(function(){$(this).toggleClass("category-icon-selected");updateUI()}),categories[b].categories[h].button=d,a.append(d)}hist_width=$("svg#histogram").innerWidth()-30;hist_height=$("svg#histogram").innerHeight()-60;var f=$("<div>",{"class":"histogram-tooltip"}),c=$("<div>",{"class":"histogram-tooltip-container"}),k=$("<div>",{"class":"histogram-tooltip-carrot"});
c.append(f).append(k);$("#sidebar-container").append(c);a=d3.select("svg#histogram");x=d3.scaleBand().rangeRound([0,hist_width]).padding(.1);y=d3.scaleLinear().rangeRound([hist_height,0]);g=a.append("g").attr("transform","translate(25,20)");a=d3.entries(annual_totals);x.domain(a.map(function(a){return a.key}));y.domain([0,d3.max(a,function(a){return a.value.total})]);g.append("g").attr("class","axis axis--x").attr("transform","translate(0,"+hist_height+")");g.selectAll(".bar-total").data(a).enter().append("rect").attr("class",
"bar-total").attr("x",function(a){return x(a.key)}).attr("y",function(a){return y(a.value.total)}).attr("width",x.bandwidth()).attr("height",function(a){return hist_height-y(a.value.total)}).on("mouseover",function(a){current_tooltip_year=a.key;f.text(a.value.current+" out of "+a.value.total+" papers currently shown");a=$(this).position();var b=c.width(),d=a.left-b/2+x.bandwidth()/2,e=b/2-x.bandwidth()/2+2;a.left<b/2&&(d=5,e=a.left-x.bandwidth()/2+4);k.css({left:e});c.css({top:a.top-90,left:d});c.show()}).on("mouseout",
function(a){current_tooltip_year==a.key&&c.hide()});g.selectAll(".bar-current").data(a).enter().append("rect").attr("class","bar-current").attr("x",function(a){return x(a.key)}).attr("y",function(a){return y(a.value.current)}).attr("width",x.bandwidth()).attr("height",function(a){return hist_height-y(a.value.current)});g.append("g").attr("class","axis axis--y").call(d3.axisLeft(y).ticks(5)).append("text").attr("transform","rotate(-90)").attr("y",6).attr("dy","0.71em").attr("text-anchor","end");g.append("g").attr("class",
"axis axis--x").attr("transform","translate(0,"+hist_height+")").call(d3.axisBottom(x)).selectAll("text").style("text-anchor","end").attr("dx","-.8em").attr("dy","-.2em").attr("transform","rotate(-70)");$("#select-mode-union").click(function(){"union"!=select_mode&&(select_mode="union",$(this).addClass("select-mode-item-selected"),$("#select-mode-inter").removeClass("select-mode-item-selected"),updateUI())});$("#select-mode-inter").click(function(){"inter"!=select_mode&&(select_mode="inter",$(this).addClass("select-mode-item-selected"),
$("#select-mode-union").removeClass("select-mode-item-selected"),updateUI())});a=$("#sample-citation");a.prop("title","Click to copy citation");a.tooltip({container:"body",html:!0});a.click(function(){var a=document.createRange(),f=window.getSelection();a.selectNodeContents(this);f.removeAllRanges();f.addRange(a);document.execCommand("copy");f.removeAllRanges();$(this).attr("title","Text copied!").tooltip("fixTitle").tooltip("show")});a.hover(null,function(){$(this).attr("title","Click to copy citation").tooltip("fixTitle")});
a=$("#select-mode-tooltip");a.prop("title",'<div style="text-align: left;"><em>Union</em> shows papers that use <strong>any</strong> of the selected topics.<br><em>Intersection</em> shows papers that use <strong>all</strong> of the selected topics.</div>');a.tooltip({container:"body",html:!0})}function compareVectors(a,b){for(var d=0,e=0;e<b.length;e++)d+=(a[e]-b[e])*(a[e]-b[e])*b[e];return d}
function createSummaryGrid(){var a=$("#modal-summary");$("#summary-grid-container").empty();summary_sort_options||(summary_sort_options=icons.map(function(a){return 0}));var b=1168-26*icons.length-20-20,d=24*thumbnails.length+66,e=thumbnails.map(function(a){var f=$(a).clone();for(key in a)f[key]=a[key];return f});0<summary_sort_options.reduce(function(a,c){return a+c},0)&&e.sort(function(a,c){var f=compareVectors(a.topic_vector,summary_sort_options),b=compareVectors(c.topic_vector,summary_sort_options);
return f!=b?f-b:c.pub_year-a.pub_year});d=d3.select("#modal-hidden-sandbox").append("svg").attr("width",1168).attr("height",d).append("g").attr("transform","translate(20,20)");d.selectAll(".grid-icon").data(icons).enter().append("svg:foreignObject").attr("class","grid-icon").attr("x",function(a,c){return b+26*c}).attr("y",0).attr("width",26).attr("height",26).append(function(a,b){a.tooltip({container:"body"});a.addClass("category-icon-small");a.removeClass("category-icon");a.removeClass("category-icon-selected");
1==summary_sort_options[b]?a.addClass("category-icon-selected"):a.removeClass("category-icon-selected");return a[0]}).on("click",function(a,b){console.log("click");console.log(a);a.tooltip("hide");summary_sort_options[b]=1-summary_sort_options[b];createSummaryGrid()});var h=e.map(function(a,c){var d=[a];a["class"]="grid-paper-rect";a.row=c;a.x=0;a.y=24*c+28;a.width=b;a.height=24;return d.concat(icons.map(function(d,f){icon=$(d).clone();icon["class"]="grid-cell-rect";icon.row=c;icon.x=26*f+b;icon.y=
24*c+28;icon.width=26;icon.height=24;icon["class"]=topics[a.doi][d.type][d.topic]?icon["class"]+" grid-cell-selected":icon["class"]+" grid-cell-unselected";return icon}))});d.selectAll(".grid-paper").data(e).enter().append("text").attr("class","grid-paper").attr("x",0).attr("y",function(a,b){return 24*b+28}).attr("width",b).attr("dy",12).attr("dx",5).attr("alignment-baseline","middle").text(function(a){return a.full_title}).call(abbreviateTitle,b);d.selectAll(".grid-cell").data(h).enter().selectAll(".grid-cell").data(function(a){return a}).enter().append("rect").attr("class",
function(a){return a["class"]}).attr("x",function(a){return a.x}).attr("y",function(a){return a.y}).attr("width",function(a){return a.width}).attr("height",function(a){return a.height}).on("click",function(b){"metadata"in b&&(a.modal("hide"),$($(b).find(".modal-target").attr("data-target")).modal("show"))});e=$("#modal-hidden-sandbox > svg").detach();$("#summary-grid-container").append(e)}
function createPaperThumbnail(a){var b=$("<div>",{"class":"col-xs-6 thumbnail-container"}),d=$("<div>",{"class":"modal-target","data-toggle":"modal","data-target":"#modal-"+a.id,"data-tooltip":"tooltip","data-container":"body",title:a.short_name}),e=$("<img>",{"class":"img-thumbnail",src:a.thumbnail_link});d.append(e);b.append(d);b.metadata=a.title+"; "+a.short_name+"; "+a.authors;b.topic_vector=icons.map(function(b){return topics[a.doi][b.type][b.topic]?1:0});for(var h in a)b[h]=a[h];return b}
function createPaperModal(a){var b=$("<div>",{id:"modal-"+a.id,"class":"modal fade"}),d=$("<div>",{"class":"modal-dialog modal-wide",role:"document"}),e=$("<div>",{"class":"modal-content"}),h=$("<div>",{"class":"modal-thumbnail"}),f=$("<img>",{"class":"img-thumbnail",src:a.thumbnail_link}),c=$("<button>",{type:"button","class":"close","data-dismiss":"modal","aria-label":"Close"}),k=$("<span>",{"class":"glyphicon glyphicon-remove","aria-hidden":"true"}),l=$("<div>",{"class":"modal-body modal-paper"}),
m=$("<h4>",{"class":"modal-title"}),n=$("<h5>"),p=$("<h6>"),q=$("<h6>"),r=$("<a>",{href:a.link,target:"_blank"}),t=icons.filter(function(b){return topics[a.doi][b.type][b.topic]}).map(function(a){a=$(a).clone();a.tooltip({container:"body"});a.removeClass("category-icon-selected");a.addClass("category-icon-static");return a});h.append(f);m.text(a.full_title);n.text("by "+a.authors);p.text(a.citation);r.text(a.link);q.text("URL: ");q.append(r);c.append(k);l.append(c).append(m).append(n).append(p).append(t);
e.append(h).append(l);d.append(e);b.append(d);return b}function createTopicIcon(a,b){var d=$("<span>",{"class":"category-icon category-icon-selected",title:categories[a].categories[b].name,"aria-hidden":"true"});categories[a].categories[b].icon?d.addClass(categories[a].categories[b].icon):d.addClass("fa fa-question");d.tooltip({container:"body"});d.type=a;d.topic=categories[a].categories[b].name;return d}
function abbreviateTitle(a,b){a.each(function(){var a=d3.select(this),e=a.text().split(/\s+/),h=e.pop(),f=[],c=parseFloat(a.attr("dx"));var k=a.node().getComputedTextLength()+c;e.reverse();if(!(k<=b))for(;k=e.pop();)if(f.push(k),a.text(f.join(" ")+"... "+h),a.node().getComputedTextLength()+c>b){f.pop();a.text(f.join(" ")+"... "+h);break}})}
function addCloseButtonToModal(a){var b=$("<button>",{type:"button","class":"close","data-dismiss":"modal","aria-label":"Close"}),d=$("<span>",{"class":"glyphicon glyphicon-remove","aria-hidden":"true"});b.append(d);$(a).find(".modal-body").prepend(b)};