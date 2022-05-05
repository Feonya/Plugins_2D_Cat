/*:
 * @target     MZ
 * @plugindesc v1.0 对物品顺序进行重新排列。
 * @author     2D_猫
 * @url        https://space.bilibili.com/137028995
 *
 * @help
 * * 使用方法：在数据库为物品命名时，物品名称前加上“x>”前缀，“x”是一个实数，代
 * 表该物品的排列优先级，也就是说，数字越小的物品在物品栏中越靠前。未加“x>”前缀
 * 的物品，将按照该物品的默认顺序排列在加了“x>”前缀的物品的后面。
 *
 * * 使用条款：免费用于任何商业或非商业目的；允许在保留原作者信息的前提下修改代
 * 码；请在你的项目中致谢“2D_猫”，谢谢！:)
 *
 * |\      /|          _
 * |-\____/-|         //
 * |        |        //
 * |  O O   |_______//
 *  \__^___/         \
 *    |              |
 *    / __  ______   \
 *   / /  \ \    / /\ \
 *  /_/    \_\  /_/  \_\
 */
 
(() => {
	Window_ItemList.prototype.makeItemList = function() {
		this._data = $gameParty.allItems().filter(item => this.includes(item));
		if (this.includes(null)) {
			this._data.push(null);
		}
		
		// 按照“x>”顺序重新排序物品
		this._data.sort((a, b) => {		
			let aOrderNum = parseInt(a.name.split(">")[0]);
			if (aOrderNum.toString() === 'NaN') aOrderNum = Infinity;
			let bOrderNum = parseInt(b.name.split(">")[0]);
			if (bOrderNum.toString() === 'NaN') bOrderNum = Infinity;
			
			return aOrderNum - bOrderNum;
		});
	};

	Window_ItemList.prototype.drawItem = function(index) {
		const item = this.itemAt(index);
		
		if (item) {
			// 获取物品去掉“x>”后的名称
			let newItemName = item.name.split(">")[1];
			if (newItemName) item.newName = newItemName;
			else			 item.newName = item.name;
		
			const numberWidth = this.numberWidth();
			const rect = this.itemLineRect(index);
			this.changePaintOpacity(this.isEnabled(item));
			this.drawItemName(item, rect.x, rect.y, rect.width - numberWidth);
			this.drawItemNumber(item, rect.x, rect.y, rect.width);
			this.changePaintOpacity(1);
		}
	};

	Window_Base.prototype.drawItemName = function(item, x, y, width) {
		if (item) {
			const iconY = y + (this.lineHeight() - ImageManager.iconHeight) / 2;
			const textMargin = ImageManager.iconWidth + 4;
			const itemWidth = Math.max(0, width - textMargin);
			this.resetTextColor();
			this.drawIcon(item.iconIndex, x, iconY);
			// 显示物品去掉“x>”后的名称
			this.drawText(item.newName, x + textMargin, y, itemWidth);
		}
	};
})();