this["spa_templates"] = this["spa_templates"] || {};
this["spa_templates"]["templates"] = this["spa_templates"]["templates"] || {};
this["spa_templates"]["templates"]["feedbackWidget"] = this["spa_templates"]["templates"]["feedbackWidget"] || {};
this["spa_templates"]["templates"]["feedbackWidget"]["body"] = Handlebars.template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<section class=\"body\">\r\n    "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"bericht") || (depth0 != null ? lookupProperty(depth0,"bericht") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"bericht","hash":{},"data":data,"loc":{"start":{"line":2,"column":4},"end":{"line":2,"column":15}}}) : helper)))
    + "\r\n</section>";
},"useData":true});
Handlebars.registerPartial("fiche", Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "    <div class=\"fiche fiche--"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"kleur") || (depth0 != null ? lookupProperty(depth0,"kleur") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"kleur","hash":{},"data":data,"loc":{"start":{"line":2,"column":29},"end":{"line":2,"column":40}}}) : helper)))
    + " fade-in\"></div>\r\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = (lookupProperty(helpers,"ifnoteq")||(depth0 && lookupProperty(depth0,"ifnoteq"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"kleur") : depth0),0,{"name":"ifnoteq","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":1,"column":0},"end":{"line":3,"column":12}}})) != null ? stack1 : "");
},"useData":true}));
this["spa_templates"]["templates"]["reversi"] = this["spa_templates"]["templates"]["reversi"] || {};
this["spa_templates"]["templates"]["reversi"]["board"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "        <tr>\r\n"
    + ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),depth0,{"name":"each","hash":{},"fn":container.program(2, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":5,"column":12},"end":{"line":10,"column":21}}})) != null ? stack1 : "")
    + "        </tr>\r\n";
},"2":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=container.escapeExpression, alias2=depth0 != null ? depth0 : (container.nullContext || {}), alias3=container.hooks.helperMissing, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "                <td class=\"board__row--y-"
    + alias1(container.lambda((container.data(data, 1) && lookupProperty(container.data(data, 1),"index")), depth0))
    + " board__col--x-"
    + alias1(((helper = (helper = lookupProperty(helpers,"index") || (data && lookupProperty(data,"index"))) != null ? helper : alias3),(typeof helper === "function" ? helper.call(alias2,{"name":"index","hash":{},"data":data,"loc":{"start":{"line":6,"column":69},"end":{"line":6,"column":79}}}) : helper)))
    + "\r\n                tile "
    + ((stack1 = (lookupProperty(helpers,"ifeq")||(depth0 && lookupProperty(depth0,"ifeq"))||alias3).call(alias2,depth0,1,{"name":"ifeq","hash":{},"fn":container.program(3, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":7,"column":21},"end":{"line":7,"column":57}}})) != null ? stack1 : "")
    + " "
    + ((stack1 = (lookupProperty(helpers,"ifeq")||(depth0 && lookupProperty(depth0,"ifeq"))||alias3).call(alias2,depth0,2,{"name":"ifeq","hash":{},"fn":container.program(3, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":7,"column":58},"end":{"line":7,"column":94}}})) != null ? stack1 : "")
    + "\">\r\n"
    + ((stack1 = container.invokePartial(lookupProperty(partials,"fiche"),depth0,{"name":"fiche","hash":{"kleur":depth0},"data":data,"indent":"                    ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "                </td>\r\n";
},"3":function(container,depth0,helpers,partials,data) {
    return "tile--fiche";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div id=\"player\"></div>\r\n<table class=\"board board--turn-"
    + alias4(((helper = (helper = lookupProperty(helpers,"turn") || (depth0 != null ? lookupProperty(depth0,"turn") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"turn","hash":{},"data":data,"loc":{"start":{"line":2,"column":32},"end":{"line":2,"column":40}}}) : helper)))
    + "\" id=\"ReversiBord\" data-player=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"currentPlayer") || (depth0 != null ? lookupProperty(depth0,"currentPlayer") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"currentPlayer","hash":{},"data":data,"loc":{"start":{"line":2,"column":72},"end":{"line":2,"column":89}}}) : helper)))
    + "\">\r\n"
    + ((stack1 = lookupProperty(helpers,"each").call(alias1,(depth0 != null ? lookupProperty(depth0,"board") : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":3,"column":4},"end":{"line":12,"column":13}}})) != null ? stack1 : "")
    + "</table>\r\n<button id=\"skip\">Pas</button>";
},"usePartial":true,"useData":true,"useDepths":true});
this["spa_templates"]["templates"]["partials"] = this["spa_templates"]["templates"]["partials"] || {};
this["spa_templates"]["templates"]["partials"]["poke"] = this["spa_templates"]["templates"]["partials"]["poke"] || {};
this["spa_templates"]["templates"]["partials"]["poke"]["card"] = Handlebars.template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div>\r\n    <img src=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"card") || (depth0 != null ? lookupProperty(depth0,"card") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"card","hash":{},"data":data,"loc":{"start":{"line":2,"column":14},"end":{"line":2,"column":24}}}) : helper)))
    + "\"/>\r\n</div>";
},"useData":true});
this["spa_templates"]["templates"]["partials"]["stats"] = this["spa_templates"]["templates"]["partials"]["stats"] || {};
this["spa_templates"]["templates"]["partials"]["stats"]["graph"] = Handlebars.template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<canvas id=\"myChart\"></canvas>";
},"useData":true});