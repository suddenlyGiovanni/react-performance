import { test, expect } from '@playwright/test'

test('Only two ListItems should not rerender when the highlighted item changes', async ({
	page,
}) => {
	await page.goto('/')
	await page.waitForLoadState('networkidle')

	// get the first item highlighted
	await page.evaluate(() => {
		const input = document.querySelector('input')
		if (!input) {
			throw new Error('🚨 could not find the input')
		}
		input.dispatchEvent(
			new KeyboardEvent('keydown', {
				key: 'ArrowDown',
				keyCode: 40,
				bubbles: true,
			}),
		)
	})

	// go to the next item and verify only two list items change highlighted state
	const changedHighlights = await page.evaluate(async () => {
		const items = Array.from(document.querySelectorAll('li'))
		const previousMarkup = items.map((item) => item.outerHTML)

		const input = document.querySelector('input')
		if (!input) {
			throw new Error('🚨 could not find the input')
		}
		input.dispatchEvent(
			new KeyboardEvent('keydown', {
				key: 'ArrowDown',
				keyCode: 40,
				bubbles: true,
			}),
		)
		await new Promise((resolve) => requestAnimationFrame(resolve))

		const nextMarkup = items.map((item) => item.outerHTML)

		return nextMarkup.filter((markup, index) => markup !== previousMarkup[index]).length
	})

	expect(
		changedHighlights,
		'🚨 Only two ListItems should change highlighted state when moving from one highlighted item to the next.',
	).toBe(2)
})
