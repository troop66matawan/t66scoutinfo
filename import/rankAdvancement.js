const ScoutbookRankAdvancement = require('scoutbook-advancement/rankAdvancement');

class RankAdvancement {
    static ADVANCEMENT = {
        SCOUT: 'scout',
        TENDERFOOT: 'tenderfoot',
        SECOND_CLASS: 'Second Class',
        FIRST_CLASS: 'First Class',
        STAR: 'Star Scout',
        LIFE: 'Life Scout',
        EAGLE: 'Eagle Scout'
    };

    static VersionLookup = {
        'scout': 'Scout',
        'tenderfoot': 'Tenderfoot',
        'Second Class':  'Second Class',
        'First Class': 'First Class' ,
        'Star Scout': 'Star Scout',
        'Life Scout':  'Life Scout',
        'Eagle Scout': 'Eagle Scout'
    }
    static getCurrentRank(scout) {
        let rank;
        if (scout && scout._advancement) {
            const rankadv = scout._advancement;
            if (rankadv.hasOwnProperty(this.ADVANCEMENT.EAGLE) && rankadv[this.ADVANCEMENT.EAGLE]._isApproved){
                rank = this.ADVANCEMENT.EAGLE;
            } else if (rankadv.hasOwnProperty(this.ADVANCEMENT.LIFE) && rankadv[this.ADVANCEMENT.LIFE]._isApproved){
                rank = this.ADVANCEMENT.LIFE;
            } else if (rankadv.hasOwnProperty(this.ADVANCEMENT.STAR) && rankadv[this.ADVANCEMENT.STAR]._isApproved){
                rank = this.ADVANCEMENT.STAR;
            } else if (rankadv.hasOwnProperty(this.ADVANCEMENT.FIRST_CLASS) && rankadv[this.ADVANCEMENT.FIRST_CLASS]._isApproved){
                rank = this.ADVANCEMENT.FIRST_CLASS;
            } else if (rankadv.hasOwnProperty(this.ADVANCEMENT.SECOND_CLASS) && rankadv[this.ADVANCEMENT.SECOND_CLASS]._isApproved){
                rank = this.ADVANCEMENT.SECOND_CLASS;
            } else if (rankadv.hasOwnProperty(this.ADVANCEMENT.TENDERFOOT) && rankadv[this.ADVANCEMENT.TENDERFOOT]._isApproved){
                rank = this.ADVANCEMENT.TENDERFOOT;
            } else if (rankadv.hasOwnProperty(this.ADVANCEMENT.SCOUT) && rankadv[this.ADVANCEMENT.SCOUT]._isApproved){
                rank = this.ADVANCEMENT.SCOUT;
            }
        }
        return rank;
    }
    static getNextRank(scout) {
       let rank = this.ADVANCEMENT.SCOUT;
        const curRank = this.getCurrentRank(scout);
        if (curRank){
            switch (curRank) {
                case this.ADVANCEMENT.SCOUT:
                    rank = this.ADVANCEMENT.TENDERFOOT;
                    break;
                case this.ADVANCEMENT.TENDERFOOT:
                    rank = this.ADVANCEMENT.SECOND_CLASS;
                    break;
                case this.ADVANCEMENT.SECOND_CLASS:
                    rank = this.ADVANCEMENT.FIRST_CLASS;
                    break;
                case this.ADVANCEMENT.FIRST_CLASS:
                    rank = this.ADVANCEMENT.STAR;
                    break;
                case this.ADVANCEMENT.STAR:
                    rank = this.ADVANCEMENT.LIFE;
                    break;
                case this.ADVANCEMENT.LIFE:
                case this.ADVANCEMENT.EAGLE:
                    rank = this.ADVANCEMENT.EAGLE;
                    break;
                default:
                    break;
            }
        }
        return rank;
    }
    static getNextRankLatestVersion(nextRank) {
        let scoutbookNextRank = this.VersionLookup[nextRank];
        let versions = ScoutbookRankAdvancement.rankMatrix[scoutbookNextRank];
        let sortedVersions = Object.keys(versions).sort();
        return sortedVersions[sortedVersions.length-1];
    }
    static createNextRank(nextRank) {
        let scoutbookNextRank = this.VersionLookup[nextRank];
        const version = this.getNextRankLatestVersion(nextRank);
        return new ScoutbookRankAdvancement(scoutbookNextRank, version);
    }
}

module.exports = RankAdvancement