import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedRestaurantsAndMenuData1742487260353
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const restaurants = [
      {
        name: 'Spice Garden',
        description: 'Authentic Indian cuisine with a modern twist.',
        address: '123 Curry Lane, Mumbai',
        country: 'INDIA',
        image_url:
          'https://source.unsplash.com/800x600/?restaurant,india,spice',
      },
      {
        name: 'Royal Dine',
        description: 'Experience the royal flavors of India.',
        address: '456 Maharaja Road, Delhi',
        country: 'INDIA',
        image_url:
          'https://source.unsplash.com/800x600/?restaurant,india,royal',
      },
      {
        name: 'Taste of India',
        description: 'A journey through the diverse cuisines of India.',
        address: '789 Spice Street, Bangalore',
        country: 'INDIA',
        image_url:
          'https://source.unsplash.com/800x600/?restaurant,india,taste',
      },
      {
        name: 'Curry House',
        description: 'Traditional curries that warm the soul.',
        address: '321 Tandoori Ave, Chennai',
        country: 'INDIA',
        image_url:
          'https://source.unsplash.com/800x600/?restaurant,india,curry',
      },
      {
        name: 'American Grill',
        description: 'Classic American grill with a variety of dishes.',
        address: '123 Main St, New York',
        country: 'AMERICA',
        image_url:
          'https://source.unsplash.com/800x600/?restaurant,america,grill',
      },
      {
        name: 'Burger Hub',
        description: 'The ultimate destination for gourmet burgers.',
        address: '456 Burger Blvd, Chicago',
        country: 'AMERICA',
        image_url:
          'https://source.unsplash.com/800x600/?restaurant,america,burger',
      },
      {
        name: 'Steak House',
        description: 'Premium steaks cooked to perfection.',
        address: '789 Steak Ave, Los Angeles',
        country: 'AMERICA',
        image_url:
          'https://source.unsplash.com/800x600/?restaurant,america,steak',
      },
      {
        name: 'City Diner',
        description: 'Your favorite diner offering comfort food.',
        address: '321 Diner Dr, San Francisco',
        country: 'AMERICA',
        image_url:
          'https://source.unsplash.com/800x600/?restaurant,america,diner',
      },
    ];

    const restaurantRecords: { id: string; country: string }[] = [];

    for (const restaurant of restaurants) {
      const result = await queryRunner.query(
        `
        INSERT INTO restaurants (id, name, description, image_url, address, country_id, created_at, updated_at)
        VALUES (
          gen_random_uuid(),
          $1,
          $2,
          $3,
          $4,
          (SELECT id FROM countries WHERE name = $5 LIMIT 1),
          NOW(),
          NOW()
        )
        RETURNING id
        `,
        [
          restaurant.name,
          restaurant.description,
          restaurant.image_url,
          restaurant.address,
          restaurant.country,
        ],
      );
      restaurantRecords.push({ id: result[0].id, country: restaurant.country });
    }

    const indianMenu = {
      Starters: {
        description: 'Crispy and flavorful starters to ignite your appetite.',
        items: ['Samosa', 'Pakora', 'Paneer Tikka'],
      },
      'Main Course': {
        description:
          "Rich and aromatic main dishes showcasing India's diverse flavors.",
        items: ['Butter Chicken', 'Paneer Tikka Masala', 'Dal Makhani'],
      },
      Desserts: {
        description: 'Sweet treats to round off your meal perfectly.',
        items: ['Gulab Jamun', 'Kheer', 'Jalebi'],
      },
    };

    const americanMenu = {
      Appetizers: {
        description: 'Tasty starters to kick off your meal.',
        items: ['Chicken Wings', 'Mozzarella Sticks', 'Onion Rings'],
      },
      Burgers: {
        description: 'Juicy burgers made with fresh, high-quality ingredients.',
        items: ['Classic Cheeseburger', 'Bacon Burger', 'Veggie Burger'],
      },
      Desserts: {
        description: 'Decadent desserts to satisfy your sweet tooth.',
        items: ['Cheesecake', 'Brownie Sundae', 'Ice Cream Cone'],
      },
    };

    for (const record of restaurantRecords) {
      const menu = record.country === 'INDIA' ? indianMenu : americanMenu;
      for (const [categoryName, details] of Object.entries(menu)) {
        const categoryResult = await queryRunner.query(
          `
          INSERT INTO menu_categories (id, restaurant_id, name, description)
          VALUES (
            gen_random_uuid(),
            $1,
            $2,
            $3
          )
          RETURNING id
          `,
          [record.id, categoryName, details.description],
        );
        const categoryId = categoryResult[0].id;
        for (const itemName of details.items) {
          const fullItemName = `${itemName}`;
          const itemDescription = `Delicious ${itemName} prepared with the finest ingredients.`;
          const price = (Math.random() * 40 + 10).toFixed(2);
          const itemImageUrl = `https://source.unsplash.com/800x600/?food,${encodeURIComponent(itemName)}`;
          await queryRunner.query(
            `
            INSERT INTO menu_items (id, category_id, name, description, price, image_url, is_available)
            VALUES (
              gen_random_uuid(),
              $1,
              $2,
              $3,
              $4,
              $5,
              true
            )
            `,
            [categoryId, fullItemName, itemDescription, price, itemImageUrl],
          );
        }
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM menu_items`);
    await queryRunner.query(`DELETE FROM menu_categories`);
    await queryRunner.query(`
      DELETE FROM restaurants 
      WHERE name IN (
        'Spice Garden', 'Royal Dine', 'Taste of India', 'Curry House',
        'American Grill', 'Burger Hub', 'Steak House', 'City Diner'
      )
    `);
  }
}
