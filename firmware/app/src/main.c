/*
 * Copyright (c) 2026 ThingG
 * SPDX-License-Identifier: Apache-2.0
 */

#include <zephyr/kernel.h>
#include <zephyr/sys/printk.h>

int main(void)
{
	printk("ThingG Gadget rev A on nRF54L15\n");

	return 0;
}
