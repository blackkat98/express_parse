const Resource = require('./Resource')

class UserResource extends Resource
{
    static single(user) {
        return {
            id: user.objectId,
            username: user.username,
            name: user.name || null,
            email: user.email || null,
            lang: user.lang || 'en',
            oauthType: user.oauthType || null,
            oauthId: user.oauthId || null,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            sessionToken: user.sessionToken || null,
        }
    }
}

module.exports = UserResource
