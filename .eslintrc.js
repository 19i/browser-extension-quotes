module.exports = {
	root: true,
	env: {
		jest: true,
		node: true,
		es6: true,
		browser: true,
		jquery: true
	},
	globals: {
		chrome: true
	},
	ignorePatterns: ['**/*.js', 'modules.d.ts', 'dist', 'dist-prod', 'node_modules', 'tmp'],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: './tsconfig.json'
	},
	plugins: ['prettier'],
	extends: [
		'airbnb-typescript/base',
		'plugin:@typescript-eslint/recommended',
		'plugin:prettier/recommended',
		'prettier',
		'prettier/@typescript-eslint'
	],
	rules: {
		'no-plusplus': 0,
		'no-shadow': 0,
		'filenames/match-regex': 0,
		'linebreak-style': ['error', 'unix'],
		'max-len': ['error', { code: 240 }],
		'class-methods-use-this': 0,
		'no-console': 0,
		'import/prefer-default-export': 0,
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-var-requires': 1,
		'@typescript-eslint/ban-ts-comment': 0,
		'@typescript-eslint/no-use-before-define': 0,
		'@typescript-eslint/explicit-module-boundary-types': 0,
		indent: [
			'error',
			'tab',
			{
				SwitchCase: 1,
				FunctionDeclaration: { body: 1, parameters: 1 },
				ignoredNodes: ['TemplateLiteral'],
				flatTernaryExpressions: true,
				offsetTernaryExpressions: true
			}
		]
	}
};
