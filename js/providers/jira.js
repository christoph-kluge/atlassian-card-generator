angular.module('jiraCardApp')
    .factory('jiraProvider', function ($http) {
        return {
            jiraBaseUrl: '',
            jiraBaseAuth: '',
            setBaseUrl: function (url) {
                this.jiraBaseUrl = url;
            },
            setBaseAuth: function (username, password) {
                this.jiraBaseAuth = "Basic " + btoa(username + ":" + password)
            },
            doGetRequest: function (url) {
                return $http({
                    method: 'GET',
                    url: this.jiraBaseUrl + url,
                    headers: {
                        'Content-Type': 'application/javascript; charset=utf-8',
                        'Authorization': this.jiraBaseAuth,
                        'X-Requested-With': 'love'
                    }
                })
            },
            doSearch: function (jql) {
                return this.doGetRequest('/search?jql=' + encodeURI(jql) + '&maxResults=1000');
            },
            getProjects: function () {
                return this.doGetRequest('/project');
            },
            getProject: function (idOrKey) {
                return this.doGetRequest('/project/' + idOrKey);
            },
            getVersions: function (projectId) {
                return this.doGetRequest('/project/' + projectId + '/versions');
            },
            getTicketsById: function(ticketIds) {
                return this.doSearch(ticketIds.map(λ("'key='+_")).join("+or+"));
            }
        }
    }
)
;