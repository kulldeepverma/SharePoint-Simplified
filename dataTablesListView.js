/*
Author          : Kuldeep Verma
Created Date    : 16th Jan, 2018.
Title           : SharePointListView Database JS
Description     : Modify SharePoint Listview using database JS and JSLink.
*/
function registerDataTables() {
	var itemCtx = {};
	itemCtx.Templates = {};
	itemCtx.Templates.Header = "<table class='display' id='datatablesListView'>";
	itemCtx.Templates.Item = ItemOverrideDataTables;
	itemCtx.Templates.Footer = "</table>";
	itemCtx.ListTemplateType = 100;
	itemCtx.OnPostRender = [];
	itemCtx.OnPostRender.push(function()
	{
		var columns = [];
		var index, len;
		for (index = 0, len = ctx.ListSchema.Field.length; index < len; ++index) {
			columns.push( {"title": ctx.ListSchema.Field[index].DisplayName });
		}
		$("#datatablesListView").dataTable(
		{
			"columns": columns
		});
	});
	SPClientTemplates.TemplateManager.RegisterTemplateOverrides(itemCtx);
}
function ItemOverrideDataTables(ctx) {
	var rowItem = "<tr>";
	var index, len;
	for (index = 0, len = ctx.ListSchema.Field.length; index < len; ++index) {
		var cell = "";
		if (Object.prototype.toString.call(ctx.CurrentItem[ctx.ListSchema.Field[index].RealFieldName]) === '[object Array]' ) {
			for (index1 = 0, len1 = ctx.CurrentItem[ctx.ListSchema.Field[index].RealFieldName].length; index1 < len1; ++index1) {
				cell += ctx.CurrentItem[ctx.ListSchema.Field[index].RealFieldName][index1].title + " ";
			}
		}
		else if (ctx.ListSchema.Field[index].Name === "LinkTitle") {
			cell = "<a href='" + ctx.displayFormUrl + "&ID=" + ctx.CurrentItem.ID +  "'>";
			cell += ctx.CurrentItem[ctx.ListSchema.Field[index].RealFieldName];
			cell += "</a>";
		}
		else if (ctx.ListSchema.Field[index].Name === "Edit") {
			cell = "<a class='fa fa-pencil-square-o' href='" + ctx.editFormUrl + "&ID=" + ctx.CurrentItem.ID + "&Source=" + _spPageContextInfo.serverRequestPath +  "'>";
			cell += "</a>";
		}
		else {
			cell = ctx.CurrentItem[ctx.ListSchema.Field[index].RealFieldName];
		}
		rowItem += "<td>" + cell + "</td>" ;
	}
	rowItem += "</tr>";
	return rowItem;
}
RegisterModuleInit("<replace with relative URL of file>", registerDataTables); 
registerDataTables();
