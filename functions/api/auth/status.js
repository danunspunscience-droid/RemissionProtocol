export const onRequestGet = async () => {
  return Response.json({
    authed: true,
    user: {
      email: 'admin@metxbootcamp.com',
      collection: 'admins'
    }
  });
};