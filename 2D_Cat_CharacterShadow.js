/*:
 *
 * [CharacterShadow hideShadow]
 * [CharacterShadow shadowName:Shadow1]
 */

(() => {
    Game_Event.prototype.getCommentSettings = function() {
        let comment  = $gameMap.event(this.eventId()).event().note.trim();
        if (!comment) return [];

        comment = comment.split('[CharacterShadow')[1];
        if (!comment) return [];

        comment = comment.split(']')[0];
        if (!comment) return [];

        return comment.trim().split(' ');
    };

    Game_Event.prototype.createShadow = function() {
        if (this._characterName[0] !== '!') {
            let settings = this.getCommentSettings();
            if (settings.length === 0 || settings[0] === '') {
                this.shadowSprite = new Sprite();
            }
        }
    };
})();