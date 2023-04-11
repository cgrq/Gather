'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'EventImages';
    return queryInterface.bulkInsert(options, [
      {
        eventId: 1,
        url:"https://i.pinimg.com/originals/cf/40/30/cf403097da8794dfc10c4fbaba6f83c9.jpg",
        preview: true
      },
      {
        eventId: 2,
        url:"https://i.pinimg.com/originals/83/c8/ee/83c8ee38c12ce01bee323c6e56157ba9.jpg",
        preview: true
      },
      {
        eventId: 3,
        url:"https://i.pinimg.com/originals/cc/24/f0/cc24f085cca3737f1c40a1015d4a7571.jpg",
        preview: true
      },
      {
        eventId: 4,
        url:"https://eudebates.tv/wp-content/uploads/2020/11/crowds-people.jpg",
        preview: true
      },
      {
        eventId: 5,
        url:"https://www.globalblackhistory.com/wp-content/uploads/2013/05/masses-of-people.jpg",
        preview: true
      },
      {
        eventId: 6,
        url:"https://media.istockphoto.com/photos/large-group-of-cheerful-people-picture-id539077871?k=20&m=539077871&s=170667a&w=0&h=EFaz-wAHUE1etUQR___Ud78CWNNSxrj1CdH1b8cr7QA=",
        preview: true
      },
      {
        eventId: 7,
        url:"https://2.bp.blogspot.com/-CM7coAW5_sU/VpmXbSvZhDI/AAAAAAAAAWg/OkSZXc-t1Y0/s1600/Water.jpg",
        preview: true
      },
      {
        eventId: 8,
        url:"https://i.ytimg.com/vi/mg4kDY_hy6o/maxresdefault.jpg",
        preview: true
      },
      {
        eventId: 9,
        url:"https://wallpapercave.com/wp/Qw8qM32.jpg",
        preview: true
      },
      {
        eventId: 10,
        url:"https://1.bp.blogspot.com/-NAVBhNCtCDE/UU1YGPiPhtI/AAAAAAAAB64/9-qJR8iIUuM/s1600/autostop.jpg",
        preview: true
      },
      {
        eventId: 11,
        url:"https://cdn.themix.org.uk/uploads/2012/09/hitchhiking.jpg",
        preview: true
      },
      {
        eventId: 12,
        url:"https://nomadsworld.com/wp-content/uploads/2018/11/hitchhiking-anywhere-istock.jpg",
        preview: true
      },
      {
        eventId: 13,
        url:"https://ca-times.brightspotcdn.com/dims4/default/2d17a6d/2147483647/strip/true/crop/5494x3663+0+0/resize/840x560!/quality/90/?url=https:%2F%2Fcalifornia-times-brightspot.s3.amazonaws.com%2F2a%2F43%2F301d23144250a09c0ea9b9c8a9db%2Fla-photos-1staff-788547-me-post-pandemic-hoops-jja-0011.JPG",
        preview: true
      },
      {
        eventId: 14,
        url:"https://bruinsbasketball.com.au/wp-content/uploads/2020/11/Pick-up-image.jpg",
        preview: true
      },
      {
        eventId: 15,
        url:"https://pickupballislife.weebly.com/uploads/3/9/1/5/39151167/9023033.jpg",
        preview: true
      },
      {
        eventId: 16,
        url:"https://www.publicdomainpictures.net/pictures/110000/velka/rotten-apples.jpg",
        preview: true
      },
      {
        eventId: 17,
        url:"https://images.freeimages.com/images/large-previews/3b3/rotten-apple-1193135.jpg",
        preview: true
      },
      {
        eventId: 18,
        url:"https://inhabitat.com/wp-content/blogs.dir/1/files/2016/02/Rotten-Apple-Hard-Carbon-Sodium-Ion-Batteries-by-KIT.jpg",
        preview: true
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'EventImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      eventId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
