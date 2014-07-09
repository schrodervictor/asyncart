var config = require(__config)();
var Controller = require(config.enginePath + '/Controller.class');

var TranslationController = (new Controller()).extend({
    init: function() {
        this.req = arguments[0];
        this.res = arguments[1];
        this.next = arguments[2];

        this.groupName = 'test';
        this.controllerName = 'translation';
        this.route = 'test/translation';
        this.template = 'test/translation';
        this.data = {};
    },
    indexAction: function() {
        console.log('Inside method index in TranslationController');

        var self = this;
        var language = 'de_DE';
        var translator = self.req.translator
        var templateTranslator = translator.getTemplateTranslator(self.template, language);

        var options = [{
            id: 'color',
            idTranslations: {
                'en_US': 'color',
                'pt_BR': 'cor',
            },
            values: [
                {
                    id: 'blue',
                    idTranslations: {
                        'en_US': 'blue',
                        'de_DE': 'blau',
                        'pt_BR': 'azul',
                    }
                },
                {
                    id: 'red',
                    idTranslations: {
                        'en_US': 'red',
                        'pt_BR': 'vermelho'
                    }
                }
            ],
            active: true
        },
        {
            id: 'size',
            idTranslations: {
                'en_US': 'size',
                'pt_BR': 'tamanho',
            },
            values: [
                {
                    id: 's',
                    label: 'small',
                    labelTranslations: {
                        'en_US': 'small',
                        'pt_BR': 'pequeno',
                    }
                },
                {
                    id: 'm',
                    label: 'medium',
                    labelTranslations: {
                        'en_US': 'medium',
                        'pt_BR': 'médio'
                    }
                }
            ],
            active: true
        }];

        var translatedOptions = translator.translateData(options, language, true);

        self.data = {
            translate: templateTranslator,
            testVar: 'teste1',
            options: JSON.stringify(options),
            tOptions: JSON.stringify(translatedOptions),
        }

        self.render();
    },
});

module.exports = TranslationController;