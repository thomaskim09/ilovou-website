import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class HintMessageService {

  constructor() { }

  profileHintMessage(id) {
    switch (id) {
      case 1: return {
        content: `Is your restaurant vegetarian-friendly? Customers which are <b>vegetarians</b> could find your restaurant easily.`
      };
      case 2: return {
        content: `Restaurant's name can be found all around in Vouchy, it is recommended to <b>name it with location</b> so that
        the customers could understand it better. <br><br> If your restaurant is one of the branches, you could name it like`,
        format: `Restaurant' name + Area name`,
        examples: [
          `Villagio Restaurant Sutera Mall`,
          `The Bread Toast Bukit Indah`
        ]
      };
      case 3: return {
        content: `Restaurant's type can be <b>searched</b> by the customers to find your restaurant, you could pick from
        the list which suits you best.`
      };
      case 4: return {
        content: `There is a <b>call button</b> at your restaurant page in Vouchy, customers could call this
        number after clicking the call button.`,
        examples: [
          `0186445754`,
          `075584512`
        ]
      };
      case 5: return {
        content: `You could upload your <b>restaurant's logo</b> or <b>environment pictures</b>. A glance at your beautiful restaurant
        could attract more customers.`,
        examples: [
          `Restaurant's logo`,
          `Environment's picture`,
          `Food's picture`,
        ]
      };
      case 6: return {
        content: `These are the tags that your customers could <b>search</b> for you. Which is your main product?
        What might people want to search when they think of your restaurant? <br><br> For example, if your restaurant
        are a western cafe. Your food tags might be something like`,
        examples: [
          `Burger`,
          `Steak`,
          `Pasta`
        ]
      };
      case 7: return {
        content: `This is the <b>Fixed Open Time</b> <br><br> We made a shortcut for you if your restaurant
        open and close at the same time every day <br><br> Just pick a time here, and all those below will be autofilled! :) `
      };
      case 8: return {
        content: `For example, if your restaurant's place is in a <b>shopping mall</b>. <br><br> Please pick a place below.
        Therefore your customers could find your restaurant when they visit that place :)`
      };
      case 9: return {
        content: `Besides the call button, we have a <b>navigate button</b> too! <br><br> Thus the full address inserted here
        will help your customers to find your restaurant on their favourite map app :)`
      };
      case 10: return {
        content: `Let's save your customers some time, and give them a <b>brief idea</b> on where you restaurant at. <br><br> For example,
        if you restaurant at the second floor of a shopping mall. Or at the corner of a street. Let them know here :)`,
        examples: [
          `Sutera Mall 2nd floor`,
          'Bukit Indah',
          'Sutera Utama'
        ]
      };
      case 11: return {
        content: `For your customers to find your restaurant in their nearby list. <b>Please place this laptop at your restaurant</b> to detect location.
        <br><br> Click the location icon to start detecting location :)`,
      };
      case 12: return {
        content: `Different limitations will attract a <b>different group</b> of potential customers`,
      };
      case 13: return {
        content: `This is the <b>Fixed Close Time</b> <br><br> We made a shortcut for you if your restaurant
        open and close at the same time every day <br><br> Just pick a time here, and all those below will be autofilled! :) `
      };
      default: return {
        content: `Welcome to restaurant's <b>profile page</b>, The information filled in here will
        be shown to the customers when they are browsing your page in Vouchy.`
      };
    }
  }

  voucherHintMessage(id) {
    switch (id) {
      case 1: return {
        content: `Click here to start adding voucher. For better user experience, <b>maximum 5 vouchers</b> slot are provided
        to each restaurant.`,
      };
      case 2: return {
        content: `You can change the <b>order</b> of the voucher to display differently to your customers. Just drag the voucher
        up or down will do the work. <br><br> You could choose to put your best selling voucher at the top to stand out
        from other vouchers`,
      };
      case 3: return {
        content: `<b>Set voucher</b> could be used to promote your existing set item. <br><br> Furthermore, Set voucher could be
        used to create new set promotion too. More benefits of set voucher are waiting for you to explore :) <br><br> if you choose to promote your existing set
        item of the menu. Please be noted that the price of set voucher <b>cannot be higher or same</b> with
        your existing set item which shares the same promotion content.`,
      };
      case 4: return {
        content: `<b>Quantity voucher</b> is good for holding customers with you. A good quantity voucher will make customers come
        every day to your restaurant and thus make them into your regular customers. <br><br> Explore more on how quantity voucher could let
        your customers come again and again :)`,
      };
      case 5: return {
        content: `<b>Cash voucher</b> could increase the chance customers spend in your restaurant. <br><br>Explore more on how cash voucher could grow
        your business :)`,
      };
      case 6: return {
        content: `How many people does this voucher <b>suitable to use on</b>? If it is a two person set just insert 2.`,
      };
      case 7: return {
        content: `How many <b>quantities could be redeemed</b> from this voucher? If it is a 10 cups coffee voucher, then just insert 10`,
      };
      case 8: return {
        content: `For set voucher, it is recommended to use pictures that could let customers know <b>what they will get</b> after redeeming.`,
        examples: [
          `Set item's picture`
        ]
      };
      case 9: return {
        content: `For quantity voucher, it is recommended to use pictures that could let customers know <b>what they will get</b> after redeeming.`,
        examples: [
          `Food item's picture`
        ]
      };
      case 10: return {
        content: `For <b>cash voucher</b>, it is recommended to use your <b>restaurant's environment</b> as a picture. Let's delight your customers with your
        restaurant's environment.`,
        examples: [
          `restaurant environment's picture`,
          `Main selling item's picture`
        ]
      };
      case 11: return {
        content: `For <b>set voucher</b>, it is recommended to name voucher like`,
        format: `No of person + set name`,
        examples: [
          `2 Person Christmas Set`,
          `5 Person Family Set`,
          `8 Person Group Lunch Set`
        ]
      };
      case 12: return {
        content: `For <b>quantity voucher</b>, it is recommended to name voucher like`,
        format: `Unit of item + name of item`,
        examples: [
          `5 x Chicken Chop`,
          `10 x Red Bean Bun`,
          `15 x Coffee`
        ]
      };
      case 13: return {
        content: `For <b>cash voucher</b>, it is recommended to name voucher like`,
        format: `Amount worth + Cash Voucher`,
        examples: [
          `RM10 Cash Voucher`,
          `RM25 Cash Voucher`,
          `RM50 Cash Voucher`
        ]
      };
      case 14: return {
        content: `For set voucher, the <b>promotion price is what the customers will pay</b>, and the <b>normal price is
        the price of the item before promotion</b>. <br><br> if you choose to promote your existing set
        item of the menu. Please be noted that the price of set voucher <b>cannot be higher or same</b> with
        your existing set item which shares the same promotion content. <br><br> If the voucher is free, just put 
        RM0 at promotion price. Even though RM0 is acceptable, but it cannot be less than RM1.50`
      };
      case 15: return {
        content: `For quantity voucher, the <b>promotion price is what the customers will pay</b>, and the <b>normal price is
        cash voucher worth</b>. <br><br>If the voucher is free, just put RM0 at promotion price. Even though RM0 is acceptable, 
        but it cannot be less than RM1.50`
      };
      case 16: return {
        content: `For cash voucher, the <b>promote price is what the customers will pay</b>, and the <b>normal price is
        cash voucher worth</b>. <br><br> For example, customers purchase the RM10 Cash Voucher with RM2 <br><br>
        If the voucher is free, just put RM0 at promotion price. Even though RM0 is acceptable, but it cannot be less than RM1.50`,
        examples: [
          `Promotion price = Amount need to pay`,
          `Normal price = Amount worth`
        ]
      };
      case 17: return {
        content: `The start date is the date of the voucher will be <b>valid to use</b>`
      };
      case 18: return {
        content: `If the day has passed the expiry date, the voucher will be <b>closed</b> and <b>removed</b> from
        your voucher list.`
      };
      case 19: return {
        content: `The <b>start time</b> that you recommended your customers to redeem the purchased voucher.`
      };
      case 20: return {
        content: `The <b>end time</b> that you recommended your customers to redeem the purchased voucher.`
      };
      case 21: return {
        content: `At this section, you could <b>describe what will your customers get</b>. A detailed elaboration
        will gain more trust from customers when purchasing. <br><br> You could also let your customers choose from available options.`,
        examples: [
          'Set Included',
          'Meal Included',
          'Beverage Included',
          'Main Dish 2 Choose 1',
          'Coffee 3 Choose 1'
        ]
      };
      case 22: return {
        content: `Name of the food item provided in the voucher.`,
        examples: [
          'Laksa',
          'Any drinks below RM9.90',
          'Any snacks below RM5'
        ]
      };
      case 23: return {
        content: `How many <b>units</b> of that food item is provided`
      };
      case 24: return {
        content: `Price of that food item <b>normally worth</b>`
      };
      case 25: return {
        content: `At this section, you could <b>describe what will your customers get</b>. A detailed elaboration
        will gain more trust from customers. <br><br> You could also let your customers choose from available options.`,
        examples: [
          'Item Included',
          'Coffee 3 Choose 1',
          'Bubble Tea 3 Choose 1'
        ]
      };
      case 26: return {
        content: `New <b>promotion price</b> that you offer to your customer.`
      };
      case 27: return {
        content: `Rules are here to protect you and your customers. <br><br> If you could not find the rules from the
        provided list. You could always <b>insert your own</b> below at the customs rules input`
      };
      case 28: return {
        content: `After typing the rule, just press <b>'Enter'</b> to add it into the rule list.
        <br><br> If you came across voucher rules you think this type of voucher should have.
         You could always send us an email to let us know. Anytime is welcome.`
      };
      case 29: return {
        content: `One way to earn more is to sell more! let's encourage your customers <b>to buy in bunch</b>.
        <br><br> You can decide how much the price for each voucher if customers choose to buy more.`
      };
      case 30: return {
        content: `When customers choose to buy <b>more</b> than the quantity inserted here, the price of each voucher will be <b>lower</b>.`
      };
      case 31: return {
        content: `Please make sure your <b>new group voucher price is not more than your voucher's offer price</b> or
        your customers will be confused.<br><br> For example, If your voucher's price is RM10, if your 
        customers choose to buy more than 3, each voucher price will be changed to RM9`
      };
      case 32: return {
        content: `If you want to make your voucher <b>limited edition</b> or just don't want everyone to have it,
        This control could come in handy.`
      };
      case 33: return {
        content: `For example, if you want to <b>limit each customer to one voucher</b>. You can set it here`
      };
      case 34: return {
        content: `If you want your customers could only buy it within the first three days. Or if you
        want to make your voucher <b>limited time edition</b>. You can set it here.`
      };
      case 35: return {
        content: `If you want to arrange a <b>release time</b> for your voucher. You can set it here.`
      };
      case 36: return {
        content: `You can change the order of the voucher to display differently to your customers. Just drag the voucher
        up or down will do the work. <br><br> This voucher is <b>sold out</b>, congratulations, sold out voucher will be moved
        to history list after <b>24 hours.</b>`
      };
      case 37: return {
        content: `If this voucher is <b>available for your restaurant's branch</b> too. You can select them here.`,
      };
      case 38: return {
        content: `<b>Monthly voucher</b> is good for holding customers with you. A good quantity voucher will make customers come
        every day to your restaurant and thus make them into your regular customers. <br><br> Explore more on how monthly voucher could let
        your customers come again and again :)`,
      };
      case 39: return {
        content: `This is use to <b>limit how many times your customers could claim each day</b>. The time will be <b>reset at 12:00am</b> every day.`,
        examples: [
          `1`,
          `2`
        ]
      };
      case 40: return {
        content: `For monthly voucher, it is recommended to use pictures that could let customers know <b>what they will get</b> after redeeming.`,
        examples: [
          `Set's picture`,
          `Food's picture`
        ]
      };
      case 41: return {
        content: `For <b>monthly voucher</b>, it is recommended to name voucher like`,
        format: `Monthly + name`,
        examples: [
          `Monthly Christmas Set`,
          `Monthly Dessert Paradise`,
          `Monthly Ramen`
        ]
      };
      case 42: return {
        content: `For monthly voucher, the <b>promote price is what the customers will pay</b>, and the <b>normal price is
        monthly voucher worth</b>. <br><br> For example, customers purchase the RM10 Cash Voucher with RM5 <br><br>
        If the voucher is free, just put RM0 at promotion price. Even though RM0 is acceptable, but it cannot be less than RM1.50`,
        examples: [
          `Promotion price = Amount need to pay`,
          `Normal price = Amount worth`
        ]
      };
      default: return {
        content: `Welcome to <b>voucher page</b>, vouchers are the best approach to attract customers to
        your restaurant! <br><br> Let's start creating vouchers for your customers and give your new customers a chance
        to fall in love with your service :)`
      };
    }
  }

  reservationHintMessage(id) {
    switch (id) {
      case 1: return {
        content: `By turning on this function, your restaurant will now <b>open for reservation</b>.
         Customers could pick a date, time, number of people and send for confirmation.`
      };
      case 2: return {
        content: `This preference is to help restaurants make decision when confirming reservations,
        <br><br> For example, customers could <b>only pick a date between the duration</b> set by you :)`
      };
      case 3: return {
        content: `If your restaurant is not open or will not accept reservation on a <b>specific date</b>.
        You could register here, and we will grey out that date on your reservation calendar so your customer
        won't pick them. <br><br> If any of the dates inserted here are expired or passed. You could delete them.`
      };
      case 4: return {
        content: `<b>Name of the rest day</b>, you can insert something like this to let your customers know why the restaurant is not accepting reservation
        that day.`,
        examples: [
          'Labour Day',
          'Scheduled for Events',
          'Owner\'s Wedding Day'
        ]
      };
      case 5: return {
        content: `You can create a <b>custom remark</b> for this specific food item.`
      };
      case 6: return {
        content: `A remark title can be something like`,
        examples: [
          'Sauces',
          'Soups',
          'Add ons',
          'Drinks'
        ]
      };
      case 7: return {
        content: `If you pick 'Single Select', customers could <b>only choose one</b> from the list. Can be used to choose sauce...etc
        <br><br> If you pick 'Multiple Select', customers could <b>choose more than one</b> from the list. Can be used to choose add ons... etc`
      };
      case 8: return {
        content: `For example, if you want your customers to choose the type of soup, places of selection.
        Anything that suits your needs. <br><br> The first item will be selected as <b>default</b> for customers. Thus, you could recommend customers
        the preferred selection by putting it as the first item.`,
        examples: [
          'None',
          'Tomato Soup',
          '4 In 1 Soup'
        ]
      };
      default: return {
        content: `Welcome to the <b>reservation page</b>, make all the tables in your restaurant open for reservation!
        and start anticipating customers to come! :)`
      };
    }
  }

  menuHintMessage(id) {
    switch (id) {
      case 1: return {
        content: `By turning on this function, your customers will now enjoy making orders using your <b>e-menu</b>!
        <br><br> They could also make take away orders to your restaurant too if they needed :) Imaging how convenient your restaurant will be!`
      };
      case 2: return {
        content: `Choosing this means you only want to receive orders from <b>take away customers</b>.`
      };
      case 3: return {
        content: `There are call buttons in others restaurant's table which are used to <b>call the waiter</b> or <b>need a bill</b>,
        <br><br> This function will do the same work and save you costs from setting up 'real' call button in the restaurant.
        <br><br> By turning on this, your customers can now call for service or bill just using their mobile phones :)`
      };
      case 4: return {
        content: `You can choose whether to view your customers' orders in food's <b>full name</b>, <b>short name</b> or <b>item code</b> as below.
        <br><br> If choosing item code, please make sure every food item in your menu has an item code with it.`,
        examples: [
          'Chicken Burger Delight',
          'Chk Bgr Dlg',
          '103',
        ]
      };
      case 8: return {
        content: `If you need all your orders to come with <b>SST</b>, you can turn on it here.`
      };
      case 9: return {
        content: `Normally it will be <b>6%</b> for SST, but if the government change their rules. You can always change the
        percentage here :)`
      };
      case 10: return {
        content: `If your restaurant also charges for <b>Service Charge</b>, you can set them up here.`
      };
      case 11: return {
        content: `By turning on this, your customers can choose to make their orders <b>'takeaway'-able</b>.`
      };
      case 12: return {
        content: `By turning on this, you can charge your customers <b>take away fee</b> when they choose to take away.`
      };
      case 13: return {
        content: `By turning on this, you can charge packaging fee <b>on each item</b> they order. <br><br>
        For example, if one customers order 5 chicken chop, each chicken chop will add on a packaging fee. (e.g. RM0.30).
        <br><br> On the other hand, leaving this off will just add (e.g. RM0.30) to the total price.`
      };
      case 14: return {
        content: `You can choose to <b>hide</b> certain category or <b>delete</b> them. <br><br> Although we will remind it again
        when you are trying to delete your category, but please be noted that <b>deleting a category will also delete all the food item
        within that category</b> :)`
      };
      case 15: return {
        content: `Add a <b>new category</b> to your menu, a category will help customers to find their favourite food more easily.`
      };
      case 16: return {
        content: `You can change the order of your categories to display differently to your customers. Just <b>drag the category
        up or down</b> will do the work. <br><br> Putting your best sellings on top will make your foods under that category
        more easier to find and order.`
      };
      case 17: return {
        content: `Click this arrow icon to <b>view the foods item</b> listed under this category.`
      };
      case 18: return {
        content: `You can choose to <b>hide</b> certain food item or <b>delete</b> them.`
      };
      case 19: return {
        content: `Add a new food to your menu.`
      };
      case 20: return {
        content: `You can change the order of your foods to display differently to your customers. Just <b>drag the food item
        up or down</b> will do the work. <br><br> Putting your best sellings on top will make your foods easier to find and order.`
      };
      case 21: return {
        content: `You can choose to <b>delete</b> certain food item here`
      };
      case 22: return {
        content: `Remark short cut could be useful if some of your foods in the menu <b>share
        the same type of remark</b>. <br><br> This can help you to save time when adding remark
        to your foods :)`,
        examples: [
          'Size (S, M, L)',
        ]
      };
      case 23: return {
        content: `By turning on this function, all foods listed under this category will only be shown to customers <b>in that
        period of time</b>. <br><br> This will be useful if you only want (e.g. Breakfast) category to be available between 8am to 11am.`
      };
      case 24: return {
        content: `You can choose which category this food item <b>belongs to</b>. Or this will come in handy if you ever want to <b>move</b>
        this food item to another category.`
      };
      case 25: return {
        content: `Short name is how the food is displayed <b>when viewing them on your merchant app</b>. Name it any way suit you :)
        <br><br> Some preferred using short name instead of item code. For example, you could choose to remove the vowel letters from the name to
        create shorter name`,
        examples: [
          'Lemon Juice => Lmn Jc',
          'Nasi Lemak => Ns Lmk'
        ]
      };
      case 26: return {
        content: `Item codes are the numbers which are listed beside the food items. You can leave this empty if there is no
        item code. <br><br> But <b>if you choose to view the order in item code mode</b> at the settings. Please make sure every item
        has an item code with it. <br><br> We will replace it with a short name if there is no item code.`
      };
      case 27: return {
        content: `A picture is worth a thousand words, <b>If it is a set item, a picture which contains all
        items</b> will be clearer for customers. <br><br> Pictures not only will make customers understand its content, but will
        also make them want to order more :)`
      };
      case 28: return {
        content: `If you want this food to only be shown to customers <b>in a period of time</b>. You can set them up here.`
      };
      case 29: return {
        content: `By turning on this function, customers will at least be <b>allowed to write a remark</b> if they wanted to.
        <br><br> Furthermore, you could also set <b>description</b>, <b>remarks</b> or <b>custom remark</b> to this specific food item.`
      };
      case 30: return {
        content: `In this section, you can <b>describe or introduce</b> this food to your customers.`
      };
      case 31: return {
        content: `You can use the <b>remark short cuts</b> created by you at the <b>'Remarks'</b> section. <br><br> A remark is used
        if you want your customers to pick type they want. For example, the type of soup, or sauces. <br><br> The remark short cuts
        will save your time if this food shares a same type of remark as other foods.`
      };
      case 32: return {
        content: `You can create a <b>custom remark</b> for this specific food item.`
      };
      case 33: return {
        content: `A remark title can be something like`,
        examples: [
          'Sauces',
          'Soups',
          'Add ons',
          'Drinks'
        ]
      };
      case 34: return {
        content: `If you pick 'Single Select', customers could <b>only choose one</b> from the list. Can be used to choose sauce...etc
        <br><br> If you pick 'Multiple Select', customers could <b>choose more than one</b> from the list. Can be used to choose add ons... etc`
      };
      case 35: return {
        content: `For example, if you want your customers to choose the size, you can name it 'Small', 'Medium', 'Large'.
        Anything that suits your needs. <br><br> The first item will be selected as <b>default</b> for customers. Thus, you could recommend customers
        the preferred selection by putting it as the first item.`,
        examples: [
          'None',
          'Black Pepper Sauce',
          'Fish Ball'
        ]
      };
      case 36: return {
        content: `The short name will be displayed along with the quantity ordered. For example,
        Chk Bgr, Ck, Frd`
      };
      case 37: return {
        content: `The price inserted here <b>will be added to the price</b> of the food. <br><br> For example, if choose 'Large' size will
        make the price from RM5 to RM7. You can just insert '2' here. <br><br> <b>If the choice will not add extra price. You can just
        put '0'</b>`,
        examples: [
          '0',
          '2'
        ]
      };
      case 38: return {
        content: `Choosing this means you only want to receive orders from <b>dine-in customers</b> :)`
      };
      case 39: return {
        content: `Choosing this means you want to receive orders from <b>dine-in and take away</b> customers!
        <br><br> All online's orders will be considered as <b>take away</b>. Thus, please make sure
        <b>Open for take away</b> is checked below :)`
      };
      case 40: return {
        content: `Ordering food using <b>e-menu</b> will let your restaurant stand out from others.`
      };
      case 41: return {
        content: `By turning on this service, there will be a <b>notify button</b> in Vouplan's order page,
        <br><br> You can <b>remind your customer that his/her order is done</b> by sending a notification to them :) <br><br> if customers still do not show up,
        you can contact them through their mobile number `
      };
      case 42: return {
        content: `By turning on this service, <b>one table can only accept order from one phone at a time</b>.
        <br><br> This is to avoid some users trying to make some fake order for another table. <br><br>
        Notes, but turning on this control, restaurant will need to make sure to close or complete the order to continue recieve new order from new arrival customers.`
      };
      case 43: return {
        content: `By turning on this service, Customers can choose whether view the menu in <b>English (Default) or Chinese</b>.
        <br><br> Please make sure every name of the category, food, and remark in your menu has an translated version with it.`
      };
      case 44: return {
        content: `This is an <b>optional</b> field. <br><br> If you have turned on the <b>two languages support</b> in menu settings. Please fill in this field.
        <br><br>Please insert <b>simplify chinese</b> only :)`,
        examples: [
          'Chicken Burger => 鸡肉汉堡',
          'Nasi Lemak => 椰浆饭'
        ]
      };
      case 45: return {
        content: `By turning on this function, customers will not <b>see the total price directly</b> when confirming orders.`,
        examples: [
          'Confirm RM42.00 => Confirm',
          'Confirm RM79.80 => Confirm'
        ]
      };
      case 46: return {
        content: `By turning on this function, when customers calling for bill, there will be <b>a pop up suggesting them to pay at the counter.</b>
        <br><br> This will be useful when your restaurant need customers to be at counter in order to make payment.`
      };
      case 47: return {
        content: `By turning on this function, we will check the table number before sending the order to you.<br><br>
        If you insert 30 as maximum table number, order which has table number between 1 and 30 will be sent only. <br><br> This is suitable for 'number-only' table number.`,
        examples: [
          '30',
          '45'
        ]
      };
      case 48: return {
        content: `By turning on this function, You can choose to <b>write a public notice for your customers</b>.
        <br><br> Your customers will see this notice when they are using your e-menu.`,
      };
      case 49: return {
        content: `If you have a new branch, or <b>anythine you wish to tell your customers</b>. You can write it here.`,
      };
      default: return {
        content: `Welcome to the <b>menu page</b>, In here, you can create your own menu for your restaurant, and customers will
        be so pleased that your restaurant is having an e-menu to make orders now! <br><br> Let's your customers
        fall in love in your service! :)`
      };
    }
  }

  billHintMessage(id) {
    switch (id) {
      default: return {
        content: `Welcome to <b>transactions summary page</b>, you can preview and print the transactions summary here`
      };
    }
  }

}
