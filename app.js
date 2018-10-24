Vue.component('player-input', {
    props: ['player'],
    template: '\
            <b-form-input\
                v-model="player.name"\
                type="text"\
                @focus.native="$event.target.select()"\
                class="player-input">\
            </b-form-input>\
        '
});

let vm = new Vue({
    el: '#app',
    data: {
        players: [
            {id: 1, name: 'Player 1', wins: 0, points: 0},
            {id: 2, name: 'Player 2', wins: 0, points: 0},
            {id: 3, name: 'Player 3', wins: 0, points: 0},
            {id: 4, name: 'Player 4', wins: 0, points: 0},
            {id: 5, name: 'Player 5', wins: 0, points: 0}
        ],
        schedule: [
            {id: 0, rest: 5, teamA: [1, 2], teamB: [3, 4], score: [0, 0]},
            {id: 1, rest: 4, teamA: [1, 3], teamB: [2, 5], score: [0, 0]},
            {id: 2, rest: 3, teamA: [2, 4], teamB: [1, 5], score: [0, 0]},
            {id: 3, rest: 2, teamA: [3, 5], teamB: [1, 4], score: [0, 0]},
            {id: 4, rest: 1, teamA: [4, 5], teamB: [2, 3], score: [0, 0]},
            {id: 5, rest: 5, teamA: [1, 3], teamB: [2, 4], score: [0, 0]},
            {id: 6, rest: 4, teamA: [2, 3], teamB: [1, 5], score: [0, 0]},
            {id: 7, rest: 3, teamA: [4, 5], teamB: [1, 2], score: [0, 0]},
            {id: 8, rest: 2, teamA: [1, 5], teamB: [3, 4], score: [0, 0]},
            {id: 9, rest: 1, teamA: [2, 4], teamB: [3, 5], score: [0, 0]},
            {id: 10, rest: 5, teamA: [2, 3], teamB: [1, 4], score: [0, 0]},
            {id: 11, rest: 4, teamA: [3, 5], teamB: [1, 2], score: [0, 0]},
            {id: 12, rest: 3, teamA: [1, 4], teamB: [2, 5], score: [0, 0]},
            {id: 13, rest: 2, teamA: [1, 3], teamB: [4, 5], score: [0, 0]},
            {id: 14, rest: 1, teamA: [3, 4], teamB: [2, 5], score: [0, 0]}
        ],
        currentMatch: null,
        teamAScore: null,
        teamBScore: null,
        resetModalVisible: false,
        selectedResetOption: 'scores',
        resetOptions: [
            {value: 'scores', text: 'Reset scores'},
            {value: 'all', text: 'Reset scores and player names'}
        ]
    },
    computed: {
        ranking () {
            let players = this.players.slice();
            return players.sort((a, b) => {
                if (a.wins > b.wins)
                    return 1;

                if (b.wins > a.wins)
                    return -1;

                return a.points - b.points;
            }).reverse();
        },
        scoreModalVisible: {
            get () {
                return this.currentMatch !== null;
            },
            set () {}
        }
    },
    created () {
        for (let key of ['players', 'schedule']) {
            if (localStorage.getItem(key)) {
                try {
                    this[key] = JSON.parse(localStorage.getItem(key));
                } catch(e) {
                    localStorage.removeItem(key);
                }
            }
        }
    },
    watch: {
        schedule: {
            handler: _.debounce (
                function (val) {
                    localStorage.setItem('schedule', JSON.stringify(val))
                },
                500
            ),
            deep: true
        },
        players: {
            handler: _.debounce (
                function (val) {
                    localStorage.setItem('players', JSON.stringify(val))
                },
                500
            ),
            deep: true
        }
    },
    methods: {
        playerName (playerId) {
            return this.players[playerId - 1].name
        },
        showScoreModal (matchId) {
            this.currentMatch = this.schedule[matchId];
        },
        setScore (e) {
            if (e.isOK === 'ok') {
                this.currentMatch.score = [parseInt(this.teamAScore), parseInt(this.teamBScore)];
            }
            this.currentMatch = null;

            this.updateRanking();
        },
        resetWinsAndPoints () {
            for (let player of this.players) {
                player.wins = 0;
                player.points = 0;
            }
        },
        updateRanking () {
            this.resetWinsAndPoints();

            for (let match of this.schedule) {
                for (let playerId of match.teamA) {
                    if (match.score[0] > match.score[1])
                        this.players[playerId - 1].wins++;
                    this.players[playerId - 1].points += match.score[0] - match.score[1];
                }

                for (let playerId of match.teamB) {
                    if (match.score[1] > match.score[0])
                        this.players[playerId - 1].wins++;
                    this.players[playerId - 1].points += match.score[1] - match.score[0];
                }
            }
        },
        reset (e) {
            if (e.isOK === 'ok') {
                localStorage.removeItem('schedule');

                if (this.selectedResetOption === 'all') {
                    localStorage.removeItem('players');
                } else {
                    this.resetWinsAndPoints();
                    // Explicitly save players in local storage as debounce in players property watcher
                    // may not finish before the page is reloaded
                    localStorage.setItem('players', JSON.stringify(this.players))
                }

                location.reload();
            }
        }
    }
});