import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import CardMedia from "@mui/material/CardMedia";
import { Stack } from "@mui/material";
import './Collection.css'

type SellOfferType = {
  description: string;
  name: string;
  symbol: string;
  price: number;
  uri: string;
  seller: string;
};

interface CollectionProps {
  items: SellOfferType[]; // Define the shape of the items prop
  address: string | undefined
  onBuyingItem: ( items: {
    description: string;
    name: string;
    symbol: string;
    price: number;
    uri: string;
    seller: string;
  }) => void
}

const Collection = ({ items, address, onBuyingItem }: CollectionProps) => {


  return (
    <Grid container spacing={2}>
      {items.map((item, index) => (
        <Grid item xs={14} sm={3} md={3} key={index}>
          <Card>
            <CardMedia
              sx={{ height: 200, objectFit: 'cover'  }}
              image={
                import.meta.env.VITE_PAY_CONTRACT_ADDREESS_IPFS_CDN + item.uri
              }
            />
            <CardContent sx={{ paddingTop: 2 }}>
              <Typography gutterBottom variant="h5" component="div">
                Title: {item.name}
              </Typography>
              {/* <Typography gutterBottom variant="body2" sx={{ color: "text.secondary" }}>
                Description: {item.description}
              </Typography> */}

              <Stack></Stack>
              <div className="show-pricee">
                <Typography variant="body2" sx={{ color: "text.primary" }}>
                  Price:
                </Typography>
                <p>{item.price / Math.pow(10, 18)} </p>
                <p>$Grass</p>
                <img className="eth-icon" src="./grass.svg" />
              </div>
            </CardContent>
            <CardActions sx={{ alignItems: "center", paddingTop: 2 }}>
              <Button
                size="small"
                variant="contained"
                color="success"
                sx={{ height: 40, width: "100%" }}
                disabled={ item.seller == address || address === undefined ? true : false}
                onClick={() => onBuyingItem(item)}
              >
                Buy
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};
export default Collection;
