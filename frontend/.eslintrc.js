module.exports = {
    overrides: [
        {
            "env": {
                "browser": true,
                "es6": true,
                "node": true
            },
            "files": [
                "*.ts"
            ],
            "extends": [
                "eslint:recommended",
                "plugin:@typescript-eslint/recommended",
                "plugin:@angular-eslint/recommended",
                "airbnb-typescript/base",
            ],
            "parserOptions": {
                "project": "tsconfig.json",
                "sourceType": "module"
            },
            "plugins": [
                "eslint-plugin-import",
                "@typescript-eslint",
                "@angular-eslint",
            ],
            "rules": {
                "@angular-eslint/component-class-suffix": [
                    "error",
                    {
                        "suffixes": [
                            "Component",
                            "Page"
                        ]
                    }
                ],
                "@angular-eslint/component-selector": [
                    "error",
                    {
                        "type": [
                            "element",
                            "attribute"
                        ],
                        "prefix": "kftarc",
                        "style": "kebab-case"
                    }
                ],
                "@angular-eslint/contextual-lifecycle": "error",
                "@angular-eslint/directive-class-suffix": [
                    "off",
                    {
                        "suffixes": [
                            "Directive"
                        ]
                    }
                ],
                "@angular-eslint/directive-selector": [
                    "error",
                    {
                        "type": "attribute",
                        "prefix": "kftarc",
                        "style": "camelCase"
                    }
                ],
                "@angular-eslint/no-attribute-decorator": "error",
                "@angular-eslint/no-empty-lifecycle-method": "off",
                "@angular-eslint/no-forward-ref": "off",
                "@angular-eslint/no-host-metadata-property": "error",
                "@angular-eslint/no-input-rename": "off",
                "@angular-eslint/no-inputs-metadata-property": "error",
                "@angular-eslint/no-output-native": "off",
                "@angular-eslint/no-output-on-prefix": "off",
                "@angular-eslint/no-output-rename": "off",
                "@angular-eslint/no-outputs-metadata-property": "error",
                "@angular-eslint/use-component-view-encapsulation": "error",
                "@angular-eslint/use-lifecycle-interface": "error",
                "@angular-eslint/use-pipe-transform-interface": "error",
                "@angular-eslint/use-component-view-encapsulation": "off",
                "@typescript-eslint/adjacent-overload-signatures": "off",
                "@typescript-eslint/ban-types": "off",
                "@typescript-eslint/consistent-type-definitions": "error",
                "@typescript-eslint/dot-notation": "off",
                "@typescript-eslint/explicit-member-accessibility": [
                    "off",
                    {
                        "accessibility": "explicit"
                    }
                ],
                "@typescript-eslint/explicit-module-boundary-types": "off",
                "@typescript-eslint/indent": [
                    "error",
                    4,
                    {
                        "SwitchCase": 1,
                        "CallExpression": {
                            "arguments": "first"
                        },
                        "FunctionDeclaration": {
                            "parameters": "first"
                        },
                        "FunctionExpression": {
                            "parameters": "first"
                        }
                    }
                ],
                "@typescript-eslint/keyword-spacing": "off",
                "@typescript-eslint/lines-between-class-members": "off",
                "@typescript-eslint/member-delimiter-style": [
                    "error",
                    {
                        "multiline": {
                            "delimiter": "semi",
                            "requireLast": true
                        },
                        "singleline": {
                            "delimiter": "semi",
                            "requireLast": false
                        }
                    }
                ],
                "@typescript-eslint/member-ordering": "off",
                "@typescript-eslint/naming-convention": "off",
                "@typescript-eslint/comma-dangle": "off",
                "@typescript-eslint/no-empty-function": "off",
                "@typescript-eslint/no-empty-interface": "error",
                "@typescript-eslint/no-explicit-any": "off",
                "@typescript-eslint/no-extra-parens": "error",
                "@typescript-eslint/no-extra-semi": "error",
                "@typescript-eslint/no-inferrable-types": [
                    "error",
                    {
                        "ignoreParameters": true
                    }
                ],
                "@typescript-eslint/no-misused-new": "error",
                "@typescript-eslint/no-non-null-assertion": "error",
                "@typescript-eslint/no-implied-eval": "off",
                "@typescript-eslint/no-shadow": [
                    "error",
                    {
                        "hoist": "all"
                    }
                ],
                "@typescript-eslint/no-this-alias": "error",
                "@typescript-eslint/no-unnecessary-boolean-literal-compare": "error",
                "@typescript-eslint/no-unused-expressions": "off",
                "@typescript-eslint/no-unused-vars": "off",
                "@typescript-eslint/no-use-before-define": "off",
                "@typescript-eslint/no-useless-constructor": "off",
                "@typescript-eslint/no-useless-escape": "off",
                "@typescript-eslint/object-curly-spacing": "off",
                "@typescript-eslint/prefer-function-type": "error",
                "@typescript-eslint/quotes": [
                    "error",
                    "single",
                    {
                        "avoidEscape": true
                    }
                ],
                "@typescript-eslint/restrict-template-expressions": "off",
                "@typescript-eslint/semi": [
                    "error",
                    "always"
                ],
                "@typescript-eslint/type-annotation-spacing": "error",
                "@typescript-eslint/unified-signatures": "error",
                "arrow-body-style": "error",
                "array-callback-return": "off",
                "arrow-parens": [
                    "off",
                    "always"
                ],
                "brace-style": [
                    "error",
                    "1tbs"
                ],
                "class-methods-use-this": "off",
                "comma-dangle": [
                    "off",
                    "always-multiline"
                ],
                "consistent-return": "off",
                "constructor-super": "error",
                "curly": [
                    "error",
                    "multi-line"
                ],
                "default-case": "off",
                "eol-last": "error",
                "eqeqeq": [
                    "error",
                    "smart"
                ],
                "func-names": "off",
                "function-paren-newline": "off",
                "guard-for-in": "off",
                "id-blacklist": [
                    "error",
                    "any",
                    "Number",
                    "number",
                    "String",
                    "string",
                    "Boolean",
                    "boolean",
                    "Undefined",
                    "undefined"
                ],
                "id-match": "error",
                "implicit-arrow-linebreak": "off",
                'import/extensions': [
                    'off',
                    'ignorePackages',{
                        js: 'never',
                        mjs: 'never',
                        jsx: 'never',
                    }
                ],
                "import/first": "off",
                "import/newline-after-import": "off",
                "import/no-cycle": "off",
                "import/no-deprecated": "warn",
                "import/no-extraneous-dependencies": "off",
                "import/no-mutable-exports": "off",
                "import/no-useless-path-segments": "off",
                "import/order": "off",
                "import/prefer-default-export": "off",
                "key-spacing": "off",
                "linebreak-style": "off",
                "max-classes-per-file": [
                    "error",
                    1
                ],
                "max-len": [
                    "error",
                    {
                        "ignorePattern": "^import|^export",
                        "code": 180
                    }
                ],
                "no-bitwise": "error",
                "no-caller": "error",
                "no-case-declarations": "off",
                "no-cond-assign": "off",
                "no-confusing-arrow": "off",
                "no-console": [
                    "error",
                    {
                        "allow": [
                            "warn",
                            "dir",
                            "time",
                            "timeEnd",
                            "timeLog",
                            "trace",
                            "assert",
                            "clear",
                            "count",
                            "countReset",
                            "group",
                            "groupEnd",
                            "table",
                            "debug",
                            "info",
                            "dirxml",
                            "error",
                            "groupCollapsed",
                            "Console",
                            "profile",
                            "profileEnd",
                            "timeStamp",
                            "context"
                        ]
                    }
                ],
                "no-continue": "off",
                "no-debugger": "error",
                "no-duplicate-imports": "error",
                "no-dupe-else-if": "off",
                "no-else-return": "off",
                "no-empty": "off",
                "no-empty-character-class": "error",
                "no-eval": "error",
                "no-fallthrough": "error",
                "no-floating-decimal": "off",
                "no-lonely-if": "off",
                "no-mixed-operators": "off",
                "no-multi-assign": "off",
                "no-multi-spaces": "off",
                "no-multi-str": "off",
                "no-multiple-empty-lines": "off",
                "no-nested-ternary": "off",
                "no-new-wrappers": "error",
                "no-output-rename": "off",
                "no-param-reassign": "off",
                "no-plusplus": "error",
                "no-prototype-builtins": "off",
                "no-restricted-imports": [
                    "error",
                    "rxjs/Rx"
                ],
                "no-restricted-globals": "off",
                "no-restricted-syntax": "off",
                "no-return-assign": "off",
                "no-self-assign": "off",
                "no-sequences": "off",
                "no-throw-literal": "error",
                "no-trailing-spaces": "error",
                "no-undef-init": "error",
                "no-underscore-dangle": "off",
                "no-unneeded-ternary": "off",
                "no-unused-labels": "error",
                "no-useless-concat": "off",
                "no-useless-escape": "off",
                "no-useless-rename": "off",
                "no-useless-return": "off",
                "no-var": "error",
                "no-whitespace-before-property": "off",
                "new-cap": "off",
                "object-curly-newline": "off",
                "object-property-newline": "off",
                "object-shorthand": "error",
                "one-var": [
                    "error",
                    "never"
                ],
                "operator-assignment": "off",
                "operator-linebreak": "off",
                "padded-blocks": "off",
                "prefer-const": "off",
                "prefer-destructuring": "off",
                "prefer-object-spread": "off",
                "prefer-promise-reject-errors": "off",
                "prefer-rest-params": "off",
                "prefer-spread": "off",
                "prefer-template": "error",
                "quote-props": [
                    "error",
                    "as-needed"
                ],
                "radix": "error",
                "space-before-blocks": "off",
                "space-before-function-paren": [
                    "error",
                    {
                        "anonymous": "always",
                        "named": "never"
                    }
                ],
                "space-unary-ops": "off",
                "spaced-comment": [
                    "error",
                    "always",
                    {
                        "markers": [
                            "/"
                        ]
                    }
                ],
                "template-curly-spacing": "off",
                "wrap-iife": "off"
            }
        },
        {
            "files": [
                "*.html"
            ],
            "extends": [
                "plugin:@angular-eslint/template/recommended"
            ],
            "parser": "@angular-eslint/template-parser",
            "plugins": [
                "@angular-eslint/template"
            ],
            "rules": {
                "@angular-eslint/template/banana-in-box": "error",
                "@angular-eslint/template/no-negated-async": "error",
            }
        }
    ]
}
